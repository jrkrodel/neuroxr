const path = require("path");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  entry: ["./src/app.js", "./src/model.js", "./src/client.js"],
  output: {
    path: path.resolve(__dirname, "dist/js"),
    filename: "bundle.js",
  },
};
