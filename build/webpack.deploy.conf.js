var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: {
    main: './src/Scroll.vue',
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: '../dist/',
    libraryTarget: 'umd',
    library: 'vue-ez-scroll',
  },
  externals: {
    vue: 'Vue'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("style.css")
  ]
}
