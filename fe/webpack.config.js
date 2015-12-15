'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var argv = require('yargs').argv;

var isBuild = argv.BUILD == 1;
var options = {
  BUILD: isBuild,
  TEST: false,
  mainFile: './src/index.ts',
  mainIndexFile: './src/index.html',
  outputFolder: isBuild ? 'dist' : 'dev',
  proxy: {
    '^/api/*|^/auth/*': 'http://localhost:3002',
    '/socket.io/*' : 'http://localhost:3002'
  },
  app_env: {
    API_URL: "'api/'",  //
    AUTH_URL: "'auth/'",  //
    //SOCKET_URL: "'socket.io/'"  //
  },
  vendors: [//instead of setting files in index.html - do it here
    'jquery',
    'angular',
    'angular-animate',
    'angular-cookies',
    'angular-touch',
    'angular-sanitize',
    'angular-messages',
    'angular-aria',
    'angular-socket-io',
    'angular-ui-router',
    'angular-material',
    'angular-toastr',
    'angular-material-icons',
    'moment',
    'socket.io-client',
    'lodash'
  ]
};

console.log(options);
var config = {
  entry: {
    app: [options.mainFile],
    vendor: options.vendors
  },
  output: {
    filename: 'js/build.js',
    path: options.outputFolder
  },
  resolve: {
    root: __dirname,
    extensions: ['', '.ts', '.js', '.json']
    //alias: {
    //  'app': 'app'
    //}
  },
  resolveLoader: {
    modulesDirectories: ["node_modules"]
  },
  module: {
    preLoaders: [
      //{ test: /\.ts$/, loader: "tslint" }
    ],
    loaders: [
      {
        test: /jquery.*js$/,
        loader: 'expose?jQuery'
      },
      {
        test: /\.ts$/,
        loaders: ['ng-annotate', 'babel-loader', 'ts-loader']},
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      },
      {
        test: /\.html$/,
        loader: 'ngtemplate?relativeTo=' + (path.resolve(__dirname, './src/app')) + '/!raw' //@TODO- change raw by html loader ??
      },
      //@TODO-- take a better look at images and fonts
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: '\.jpg$',
        exclude: /node_modules/,
        loader: 'file'
      }, {
        test: '\.png$',
        exclude: /node_modules/,
        loader: 'file'
      }

    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor-[hash].js'),
    new webpack.DefinePlugin(options.app_env),
    new HtmlWebpackPlugin({
      template: options.mainIndexFile,
      inject: 'body',
      hash: true
    }),
    new CopyWebpackPlugin([
      { from: './src/favicon.ico' }
    ])
  ]
};
if (!options.TEST && !options.BUILD) {
  config.devtool = 'source-map';
  config.devServer = {
    contentBase: './dev',
    port: 3000,
    proxy: options.proxy
  };

}
if (options.BUILD) {

  config.plugins.push(
    //new webpack.NoErrorsPlugin(),
    // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
    // Minify all javascript, switch loaders to minimizing mode
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true)
    //new webpack.optimize.UglifyJsPlugin({
    //  screwIE8: true
    //})
  );
}
if (options.TEST) {
  config.context = __dirname + '/src';
  config.entry = './index.ts';
  config.module.postLoaders = [
    {
      test: /\.ts$/,
      exclude: [
        /node_modules/,
        /spec.ts$/
      ],
      loader: 'istanbul-instrumenter'
    }
  ]
}
config.plugins.push(new webpack.DefinePlugin({
  ON_TEST: (argv.NODE_ENV === 'test' || process.env.NODE_ENV === 'test' )
}));


module.exports = config;

