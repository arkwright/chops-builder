module.exports = {
  entry: __dirname + '/app/entry.js',
  output: {
    path: __dirname + '/build',
    publicPath: '/build/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
    ]
  }
};
