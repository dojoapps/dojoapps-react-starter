/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const AssetsPlugin = require('assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'

function getPlugins() {
  const plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: 2,
    }),
    new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(pt-br)$/),
    new webpack.optimize.CommonsChunkPlugin('manifest'),
    new WebpackMd5Hash(),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, '../public') },
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      chunksSortMode: 'dependency',
      hash: false,
      inject: 'body',
      minify: {
        collapseWhitespace: true,
      },
    }),
    new ExtractTextPlugin({
      filename: 'assets/style.[chunkhash].css',
      allChunks: false,
      disable: isDev,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: !isDev,
      debug: isDev,
    }),
  ]

  switch (env) {
    case 'production':
      plugins.push(new webpack.optimize.DedupePlugin())
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        screw_ie8: true, minimize: true, sourceMap: true, compress: { warnings: false },
      }))
      plugins.push(new AssetsPlugin())
      break
    case 'development':
      plugins.push(new webpack.HotModuleReplacementPlugin())
      plugins.push(new webpack.NoErrorsPlugin())
      break
    default:
      break
  }

  return plugins
}

function getEntry() {
  const entry = []

  if (env === 'development') { // only want hot reloading when in dev.
    entry.push('webpack-hot-middleware/client')
  }

  entry.push(path.resolve(__dirname, '../src/index'))
  return entry
}

const styleLoaders = [
  {
    loader: 'css',
    query: {
      sourceMap: true,
      importLoaders: 1,
      localIdentName: '[name]__[local]___[hash:base64:5]',
      modules: false,
    },
  },
  'postcss',
  {
    loader: 'sass',
    query: {
      sourceMap: true,
    },
  },
]

function getLoaders() {
  const loaders = [{
    test: /(\.js|\.jsx)$/,
    loader: 'babel',
    include: path.resolve(__dirname, '../src'),
  }, {
    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url?limit=65000&mimetype=application/font-woff&name=assets/fonts/[name].[ext]',
  }, {
    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url?limit=65000&mimetype=application/font-woff2&name=assets/fonts/[name].[ext]',
  }, {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url?limit=65000&mimetype=application/octet-stream&name=assets/fonts/[name].[ext]',
  }, {
    test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url?limit=65000&mimetype=application/font-otf&name=assets/fonts/[name].[ext]',
  }, {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=assets/fonts/[name].[ext]',
  }, {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'babel!svg-react',
  }, {
    test: /\.json/,
    loader: 'json',
  }, {
    test: /(\.scss|\.css)$/,
    loader: ExtractTextPlugin.extract({
      fallbackLoader: ['style-loader'],
      loader: styleLoaders,
    }),
  }]

  if (env === 'development') {
    loaders.push({
      test: /\.png$/,
      loader: 'url',
    })
    loaders.push({
      test: /\.jpg$/,
      loader: 'url',
    })
  } else {
    loaders.push({
      test: /\.png$/,
      loader: 'file?name=assets/[name].[ext]',
    })
    loaders.push({
      test: /\.jpg$/,
      loader: 'file?name=assets/[name].[ext]',
    })
  }

  return loaders
}

module.exports = {
  devtool: env === 'production' ? false : 'inline-source-map',
  entry: getEntry(),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: env === 'production' ? 'assets/[name].[chunkhash].js' : 'assets/[name].[hash].js',
    chunkFilename: env === 'production' ? 'assets/[name].[chunkhash].js' : 'assets/[name].[hash].js',
    publicPath: '/',
  },
  plugins: getPlugins(),
  resolve: {
    extensions: ['.jsx', '.scss', '.js', '.json'],
    alias: {
    },
    modules: [
      'node_modules',
      path.resolve(__dirname, '../src'),
      path.resolve(__dirname, '../node_modules'),
    ],
  },
  module: {
    rules: getLoaders(),
  },
}
