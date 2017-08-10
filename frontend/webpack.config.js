/*********************************************************************************************
 *******************************  Webpack Requires & Plugins *********************************
 ********************************************************************************************/
// process.traceDeprecation = true; // trace DeprecationWarning's
process.noDeprecation = true; // suppressed DeprecationWarning's

const chalk = require('chalk');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const AutoPrefixer = require('autoprefixer');
const querystring = require('querystring');
const AssetsPlugin = require('assets-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const webpackMergeDll = webpackMerge.strategy({ plugins: 'replace' });
const OptimizeJsPlugin = require('optimize-js-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ngToolsWebpack = require('@ngtools/webpack');

/*********************************************************************************************
 *******************************  Webpack Constants/Vars *************************************
 ********************************************************************************************/

const autoPrefixerOptions = { browsers: ['last 2 versions'] };

/*********************************************************************************************
 *******************************  Imported Webpack Constants/Vars ****************************
 ********************************************************************************************/

  // const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const helpers = require('./config/helpers.js');
const webpackConditionals = require('./config/webpack.conditionals');
const sassVarsConfig = webpackConditionals.sassVarsConfig;
const susyIsDevServer = webpackConditionals.susyIsDevServer;
const ENVlc = webpackConditionals.ENVlc;
let AOT = webpackConditionals.AOT;
const JIT = webpackConditionals.JIT;
const DEBUG = webpackConditionals.DEBUG;
const ENV = webpackConditionals.ENV;
const isProduction = webpackConditionals.isProduction;
const isDevServer = webpackConditionals.isDevServer;
const isDLLs = webpackConditionals.isDLLs;
const METADATA = webpackConditionals.METADATA;
const outputDir = helpers.paths.outputDir;

module.exports = {
  resolve: {
    extensions: ['.ts', '.js']
  },
  entry: './src/app-components/app/main.jit.ts',
  output: {
    path: path.resolve(__dirname, './dist/'),
    publicPath: '/dist/',
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new ngToolsWebpack.AotPlugin({
      tsConfigPath: './tsconfig.aot.json'
    })
  ],
  module: {
    loaders: [
      // { test: /\.scss$/, loaders: ['raw-loader', 'sass-loader'] },
      {
        test: /\.scss$/, loaders:
        [
          'raw-loader', 'sass-loader?sourceMap',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                './src/assets/styles/variables.scss',
                './src/assets/styles/mixins.scss']
            }
          }, /**
         * The sass-vars-loader will convert any module.exports of a .JS or .JSON file into valid SASS
         * and append to the beginning of each .scss file loaded.
         *
         * See: https://github.com/epegzz/sass-vars-loader
         */
          {
            loader: '@epegzz/sass-vars-loader?',
            options: querystring.stringify({
              vars: JSON.stringify({
                susyIsDevServer: susyIsDevServer
              })
            })
          }
        ] // dev mode
      },

      // {
      //   test: /\.(scss)$/,
      //   use: isDevServer ?
      //     ['style', 'css?sourceMap',
      //       {
      //         loader: 'postcss',
      //         options: {postcss: [AutoPrefixer(autoPrefixerOptions)], sourceMap: true}
      //       }, 'sass-loader?sourceMap',
      //       {
      //         loader: 'sass-resources-loader',
      //         options: {
      //           resources: ['./src/assets/styles/variables.scss', './src/assets/styles/mixins.scss'],
      //         }
      //       }, /**
      //      * The sass-vars-loader will convert any module.exports of a .JS or .JSON file into valid SASS
      //      * and append to the beginning of each .scss file loaded.
      //      *
      //      * See: https://github.com/epegzz/sass-vars-loader
      //      */
      //       {
      //         loader: '@epegzz/sass-vars-loader?',
      //         options: querystring.stringify({
      //           vars: JSON.stringify({
      //             susyIsDevServer: susyIsDevServer,
      //           }),
      //         })
      //       }] : // dev mode
      //        ExtractTextPlugin.extract({
      //          fallback: "css-loader",
      //          use: ['css?sourceMap', {
      //            loader: 'postcss',
      //            options: {postcss: [AutoPrefixer(autoPrefixerOptions)], sourceMap: true}
      //          }, 'sass-loader?sourceMap', {
      //            loader: 'sass-resources-loader',
      //            options: {
      //              resources: ['./src/assets/styles/variables.scss', './src/assets/styles/mixins.scss'],
      //            }
      //          }, {
      //            loader: '@epegzz/sass-vars-loader?',
      //            options: querystring.stringify({
      //              vars: JSON.stringify({
      //                susyIsDevServer: susyIsDevServer,
      //              }),
      //              // // Or use 'files" object to specify vars in an external .js or .json file
      //              // files: [
      //              //    path.resolve(helpers.paths.appRoot + '/assets/styles/sass-js-variables.js')
      //              // ],
      //            })
      //          }],
      //          publicPath: '/' // 'string' override the publicPath setting for this loader
      //        })
      // },
      { test: /\.css$/, loader: 'raw-loader' },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.ts$/, loader: ['@ngtools/webpack'] }
    ]
  },
  devServer: {
    historyApiFallback: true
  }
};

console.log("\n \n==================================================");

if (ENV) {

  var ENV_color = ENV === 'development' ? chalk.bold.cyan : chalk.bold.green;
  var DEBUG_color = DEBUG ? chalk.blue : chalk.red;
  var AOT_color = AOT ? chalk.blue : chalk.red;

  console.log(ENV_color("            Building for: " + ENV));
  console.log(AOT_color("            AOT: " + AOT));
  console.log(DEBUG_color("            DEBUG: " + DEBUG));
  console.log("            isDevServer: " + isDevServer);
  console.log("            isProduction: " + isProduction);
  console.log("            isDLLs: " + isDLLs);
  console.log("            ENVlc: " + ENVlc);
  console.log("            isDevServer: " + isDevServer);
  console.log("            helpers.paths.root: " + helpers.paths.root);
  console.log("            outputDir: " + helpers.root(outputDir));

} else {
  console.log("            NODE_ENV not set!");
}
console.log("==================================================\n \n");