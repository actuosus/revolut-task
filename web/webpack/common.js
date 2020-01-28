const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

const ROOT_PATH = path.join(__dirname, "..", "..");
const NODE_MODULES_PATH = path.join(ROOT_PATH, "node_modules");
const DIST_PATH = path.join(ROOT_PATH, "static");
const APP_PATH = path.join(ROOT_PATH, "src");
const WEB_PATH = path.join(ROOT_PATH, "web");
const TS_CONFIG_PATH = path.join(ROOT_PATH, "tsconfig.json");

const buildConfig = (env, argv) => ({
  entry: ROOT_PATH,

  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "eslint-loader",
        include: APP_PATH,
        enforce: "pre"
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        include: [
          path.join(NODE_MODULES_PATH, "react-navigation"),
          path.join(NODE_MODULES_PATH, "@react-navigation"),
          path.join(NODE_MODULES_PATH, "react-native-gesture-handler"),
          path.join(NODE_MODULES_PATH, "react-native-tab-view"),
          path.join(NODE_MODULES_PATH, "react-navigation-stack"),
          path.join(NODE_MODULES_PATH, "react-native-safe-area-view")
        ],
        enforce: "pre"
      },
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        include: APP_PATH
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({ __DEV__: argv.mode === "development" }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(WEB_PATH, "template.html")
    }),
    new ForkTsCheckerWebpackPlugin({ tsconfig: TS_CONFIG_PATH, async: true }),
    new FaviconsWebpackPlugin({
      devMode: "webapp",
      logo: path.join(WEB_PATH, "images", "revolut-icon.svg"),
      favicons: {
        appName: "Revolut Exchange Task"
        //   appDescription: "App code example for Revolut",
        //   developerName: "Arthur Chafonov",
        //   // developerURL: null, // prevent retrieving from the nearest package.json
        //   background: "#fff",
        //   theme_color: "#fff"
      }
    })
  ]
});

module.exports = {
  buildConfig,
  APP_PATH,
  DIST_PATH,
  WEB_PATH
};
