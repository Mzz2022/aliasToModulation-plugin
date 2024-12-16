const path = require("path");
module.exports = {
  entry: "./src/index.ts",
  // entry属性指定了入口文件的路径，这里是src/index.ts。
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  // output属性指定了输出文件的名称和路径。
  // 这里将输出文件命名为index.js，路径为dist目录下。
  // __dirname是Node.js中的一个全局变量，表示当前执行脚本所在的目录。
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  // resolve属性配置了模块解析规则。extensions指定了哪些文件扩展名可以被自动解析。
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  // module属性配置了模块的处理规则。
  // 这里使用了ts-loader来处理.ts和.tsx文件，
  mode: "production",
  // production模式会启用性能优化，
  // 而development模式则提供了详细的错误信息和源映射（source maps）。
};
