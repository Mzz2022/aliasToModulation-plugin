const path = require("path");
const fs = require("fs");

class TypescriptAliasPlugin {
  // tsconfigRoot，表示tsconfig.json所在的根目录
  constructor(options) {
    if (!options || !options.tsconfigRoot) {
      // 抛出更详细的错误提示，指明缺少tsconfigRoot配置项
      throw new Error(
        "必须提供tsconfigRoot配置项，用于指定tsconfig.json所在的根目录"
      );
    }
    this.tsconfigRoot = options.tsconfigRoot;
  }

  // 提取合并别名配置的逻辑到单独的函数，增强代码复用性和可读性
  mergeAliasIntoWebpackConfig(compiler, alias) {
    compiler.options.resolve = {
      ...compiler.options.resolve,
      alias: {
        ...compiler.options.resolve?.alias,
        ...alias,
      },
    };
  }

  apply(compiler) {
    compiler.hooks.afterResolvers.tap("TypescriptAliasPlugin", async () => {
      try {
        // 更清晰的变量命名，tsconfigFilePath明确表示是tsconfig.json的文件路径
        const tsconfigFilePath = path.resolve(
          this.tsconfigRoot,
          "tsconfig.json"
        );
        console.log("tsconfig.json文件路径:", tsconfigFilePath);
        if (!fs.existsSync(tsconfigFilePath)) {
          throw new Error(
            `在 ${this.tsconfigRoot} 目录下未找到tsconfig.json文件`
          );
        }
        // 解析tsconfig.json为对象，可考虑改为异步读取（参考下方注释）
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigFilePath, "utf-8"));
        const paths = tsconfig.compilerOptions?.paths;
        console.log("tsconfig.json中compilerOptions.paths配置:", paths);
        if (!paths) {
          console.warn("tsconfig.json中没有paths配置");
          return;
        }

        const alias = {};
        Object.keys(paths).forEach((aliasKey) => {
          const relativePathArr = paths[aliasKey];
          if (!relativePathArr || relativePathArr.length === 0) {
            console.warn(`别名 ${aliasKey} 没有有效路径配置`);
            return;
          }
          const relativePath = relativePathArr[0];
          // 增加对路径合法性等情况的简单判断，比如确保不是空字符串等
          if (!relativePath || typeof relativePath !== "string") {
            console.warn(`别名 ${aliasKey} 对应的相对路径无效`);
            return;
          }
          try {
            const absolutePath = path.resolve(this.tsconfigRoot, relativePath);
            alias[aliasKey.replace("/*", "")] = absolutePath.replace("/*", "");
          } catch (pathError) {
            console.error(`处理别名 ${aliasKey} 的路径时出错:`, pathError);
          }
        });
        console.log("提取的别名配置:", alias);

        // 调用单独的函数来合并别名配置到Webpack配置中
        this.mergeAliasIntoWebpackConfig(compiler, alias);
        console.log("TypescriptAliasPlugin: 别名注入成功");
      } catch (error) {
        console.error("TypescriptAliasPlugin: 处理失败", error);
      }
    });
  }
}

module.exports = TypescriptAliasPlugin;
