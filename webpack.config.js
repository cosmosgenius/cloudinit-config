module.exports = {
  target: "webworker",
  mode: "production",
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      { test: /\.hbs$/,
        loader: "handlebars-loader"
      }
    ],
  },
}
