const path = require('path');
const qs = require('qs');
const argv = require('minimist')(process.argv.slice(2));
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProduction = !!((argv.env && argv.env.production) || argv.p);
const sourceMapQueryStr = !isProduction ? '+sourceMap' : '-sourceMap';

module.exports = {
  entry: {
    app: [path.resolve(__dirname, '../src/main.js')]
  },
  output: {
    chunkFilename: '[id].chunk.js',
    filename: 'js/[name].[hash].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    sourceMapFilename: '[name].[hash].js.map'
  },
  resolve: {
    alias: {
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      'src': path.resolve(__dirname, '../src'),
      'vue$': 'vue/dist/vue.js'
    },
    extensions: ['*','.js','.vue']
  },
  devServer: {
    stats: "errors-only",
    historyApiFallback: true,
    inline: true,
    port: 8080
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
        test: /\.(js?|vue)$/
      },
      {
        exclude: [/(node_modules)(?![/|\\](bootstrap|foundation-sites))/],
        test: /\.js$/,
        loaders: [{
          loader: 'babel-loader',
          query: {
            cacheDirectory: true
          }
        }]
      },
      {
        exclude: /node_modules/,
        loader: 'vue-loader',
        test: /\.vue$/
      },
      {
        exclude: /node_modules/,
        loader: 'html-loader',
        test: /\.html$/
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, '../src'),
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            `css-loader?${sourceMapQueryStr}`,
          ]
        }),
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, '../src'),
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          publicPath: '../',
          use: [
            `css-loader?${sourceMapQueryStr}`,
            `resolve-url-loader?${sourceMapQueryStr}`,
            `sass-loader?${sourceMapQueryStr}`
          ]
        }),
      },
      {
        test: /\.(png|jpe?g|gif|svg|xml|json)$/,
        include: path.resolve(__dirname, '../src'),
        loaders: [
          `file-loader?${qs.stringify({
            name: 'assets/img/[name].[ext]',
          })}`
        ]
      },
      {
        test: /\.(ttf|eot)$/,
        include: path.resolve(__dirname, '../src'),
        loader: `file-loader?${qs.stringify({
          name: 'assets/vendor/[name].[ext]'
        })}`
      },
      {
        test: /\.woff2?$/,
        include: path.resolve(__dirname, '../src'),
        loader: `url-loader?${qs.stringify({
          limit: 10000,
          mimetype: 'application/font-woff',
          name: 'assets/vendor/[name].[ext]'
        })}`
      },
      {
        test: /\.(ttf|eot|woff2?|png|jpe?g|gif|svg)$/,
        include: /node_modules/,
        loader: 'file-loader',
        query: {
          name: 'assets/vendor/[name].[ext]'
        }
      }
    ]
  }
};
