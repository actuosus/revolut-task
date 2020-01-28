import proxy from "http-proxy-middleware";

const target = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";

let _proxyRes;

const ecbProxy = proxy({
  target,
  pathRewrite: { "^/api/rates/ecb": "" },
  changeOrigin: true,
  onProxyRes(proxyRes) {
    _proxyRes = proxyRes;
  }
});

export function handler(event, context, callback) {
  ecbProxy(_, _, () => {
    if (_proxyRes) {
      return res.end(_proxyRes);
    }

    callback(null, _proxyRes.body);
  });
}
