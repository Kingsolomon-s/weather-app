// webpack.prod.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'main.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    })
  ],
  module: {
    rules: [
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
      { test: /\.html$/i, loader: 'html-loader' },
      { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset/resource' }
    ]
  }
}
