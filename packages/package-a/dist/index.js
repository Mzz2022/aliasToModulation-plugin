!(function (e, o) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = o())
    : "function" == typeof define && define.amd
    ? define([], o)
    : "object" == typeof exports
    ? (exports.a = o())
    : (e.a = o());
})(this, () =>
  (() => {
    "use strict";
    var e = {
        519: (e, o) => {
          Object.defineProperty(o, "__esModule", { value: !0 }),
            (o.hello = void 0),
            (o.hello = "Hello from SDK");
        },
      },
      o = {};
    function t(r) {
      var l = o[r];
      if (void 0 !== l) return l.exports;
      var n = (o[r] = { exports: {} });
      return e[r](n, n.exports, t), n.exports;
    }
    var r = {};
    return (
      (() => {
        var e = r;
        Object.defineProperty(e, "__esModule", { value: !0 });
        const o = t(519);
        console.log(o.hello);
      })(),
      r
    );
  })()
);
