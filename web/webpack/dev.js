const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const { buildConfig, APP_PATH, WEB_PATH } = require('./common');

module.exports = (env, argv) => (
  merge(buildConfig(env, argv), {
    entry: path.join(WEB_PATH, 'index.hmr.js'),
    devtool: 'inline-source-map',

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ],

    devServer: {
      contentBase: APP_PATH,
      openPage: '',
      inline: true,
      stats: 'minimal',
      open: true,
      host: '0.0.0.0',
      port: 9999,
      hot: true,
      historyApiFallback: true,
      proxy: {
        '/api/rates/ecb': {
          target: 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
          pathRewrite: {'^/api/rates/ecb' : ''},
          changeOrigin: true,
          logLevel: 'debug'
        },
        '/api/rates/openexchange': {
          target: 'https://openexchangerates.org/api/latest.json?app_id=4b4e4b1021c740d897816c64808b4de5',
          pathRewrite: {'^/api/rates/openexchange' : ''},
          changeOrigin: true,
          logLevel: 'debug'
        }
      }
    },
  })
);
