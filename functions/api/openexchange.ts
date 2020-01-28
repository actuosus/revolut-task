import proxy from "http-proxy-middleware";

const target =
  "https://openexchangerates.org/api/latest.json?app_id=4b4e4b1021c740d897816c64808b4de5";

let _proxyRes;

const ecbProxy = proxy({
  target,
  pathRewrite: { "^/api/rates/openexchange": "" },
  changeOrigin: true,
  onProxyRes(proxyRes) {
    _proxyRes = proxyRes;
  }
});

export function handler(event, context, callback) {
  ecbProxy(_, _, () => {
    if (_proxyRes) {
      callback(null, _proxyRes.body);
    }
  });
}
