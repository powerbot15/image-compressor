const path = require('path');

module.exports = {
  entry: './image-compressor.js',
  output: {
    filename: 'image-compressor.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ImageCompressor',
    libraryTarget: 'umd'
  },
};
