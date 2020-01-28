import * as http from "http";
import proxy from "http-proxy-middleware";
import { NextApiRequest, NextApiResponse } from "next";

let _proxyRes: http.IncomingMessage | undefined;

const target =
  "https://openexchangerates.org/api/latest.json?app_id=4b4e4b1021c740d897816c64808b4de5";

const openExchangeProxy = proxy({
  target,
  pathRewrite: { "^/api/rates/openexchange": "" },
  changeOrigin: true,
  onProxyRes(proxyRes) {
    _proxyRes = proxyRes;
  }
});

export default (req: NextApiRequest, res: NextApiResponse) => {
  return openExchangeProxy(req, res, () => {
    if (_proxyRes) {
      return res.end(_proxyRes);
    }

    res.statusCode = 500;
    return res.end();
  });
};
