const {
  getHTMLPlugins,
  getOutput,
  getCopyPlugins,
  getFirefoxCopyPlugins,
  getEntry,
  getResolves
} = require("./webpack.utils");
const config = require("./config.json");
const webpack = require("webpack");

const generalConfig = {
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        loader: "babel-loader",
        exclude: /node_modules/,
        test: /\.(js|jsx)$/,
        query: {
          presets: ["@babel/preset-env", "@babel/preset-react"]
        },
        resolve: {
          extensions: [".js", ".jsx"]
        }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["eslint-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  },
  resolve: getResolves()
};

module.exports = [
  {
    ...generalConfig,
    entry: getEntry(config.chromePath),
    output: getOutput("chrome", config.devDirectory),
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(config.DEV_BACKEND_URL),
        AUTH_URL: JSON.stringify(config.DEV_AUTH_URL),
        DASHBOARD_URL: JSON.stringify(config.DEV_DASHBOARD_URL),
        AUTH_CALLBACK_URL: JSON.stringify(config.DEV_AUTH_CALLBACK_URL)
      }),
      ...getHTMLPlugins("chrome", config.devDirectory, config.chromePath),
      ...getCopyPlugins("chrome", config.devDirectory, config.chromePath)
    ]
  },
  {
    ...generalConfig,
    entry: getEntry(config.operaPath),
    output: getOutput("opera", config.devDirectory),
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(config.DEV_BACKEND_URL),
        AUTH_URL: JSON.stringify(config.DEV_AUTH_URL),
        DASHBOARD_URL: JSON.stringify(config.DEV_DASHBOARD_URL),
        AUTH_CALLBACK_URL: JSON.stringify(config.DEV_AUTH_CALLBACK_URL)
      }),
      ...getHTMLPlugins("opera", config.devDirectory, config.operaPath),
      ...getCopyPlugins("opera", config.devDirectory, config.operaPath)
    ]
  },
  {
    ...generalConfig,
    entry: getEntry(config.firefoxPath),
    output: getOutput("firefox", config.devDirectory),
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(config.DEV_BACKEND_URL),
        AUTH_URL: JSON.stringify(config.DEV_AUTH_URL),
        DASHBOARD_URL: JSON.stringify(config.DEV_DASHBOARD_URL),
        AUTH_CALLBACK_URL: JSON.stringify(config.DEV_AUTH_CALLBACK_URL)
      }),
      ...getFirefoxCopyPlugins(
        "firefox",
        config.devDirectory,
        config.firefoxPath
      ),
      ...getHTMLPlugins("firefox", config.devDirectory, config.firefoxPath)
    ]
  }
];
