// webpack.config.js 
const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production', 
  entry: {
    firebaseBundle: './src/firebase.js',       
    // indexBundle: './src/index.js',    
  },
  output: {
    path: path.resolve(__dirname, 'public/js'), 
    // 2. 👇 USE [name] to reference the key names above
    filename: '[name].js', 
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // NO 'options' BLOCK HERE
        },
      },
    ],
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     template: './public/index.html', // Point to your source HTML
  //     filename: 'index.html',       // Output filename
  //     inject: 'body',               // Injects scripts at the bottom of body
  //   }),
  // ],
};