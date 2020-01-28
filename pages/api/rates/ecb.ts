import * as http from "http";
import proxy from "http-proxy-middleware";
import { NextApiRequest, NextApiResponse } from "next";

let _proxyRes: http.IncomingMessage | undefined;

const target = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";

const ecbProxy = proxy({
  target,
  pathRewrite: { "^/api/rates/ecb": "" },
  changeOrigin: true,
  onProxyRes(proxyRes) {
    _proxyRes = proxyRes;
  }
});

export default (req: NextApiRequest, res: NextApiResponse) => {
  return ecbProxy(req, res, () => {
    if (_proxyRes) {
      return res.end(_proxyRes);
    }

    res.statusCode = 500;
    return res.end();
  });
};
