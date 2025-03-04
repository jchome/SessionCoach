const path = require('path');


module.exports = {
  entry: './app/assets/index.js',
  output: {
    filename: 'assets/index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  watchOptions: { 
    ignored: './node_modules/' 
  },
  module: {
    rules: [
        {
          // CSS Loader
          test: /\.css$/i,
          use: [
            { 
              loader: 'style-loader',
            }, 
            'css-loader' // Resolve imports
          ],
        },
        {
          test: /\.(jpg|png|svg|gif)$/,
          type: 'asset/resource',
          generator: {
            outputPath: 'assets/img/',
            filename: '[name][ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/inline',
        },
    ],
  },
  plugins: [
  ]
};