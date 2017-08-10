/*********************************************************************************************
 *******************************  Webpack Requires & Plugins *********************************
 ********************************************************************************************/

const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const webpackMergeDll = webpackMerge.strategy({plugins: 'replace'});
const webpack = require('webpack');
const helpers = require('./helpers');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
// const DllBundlesPlugin = require('../node_modules_custom/webpack-dll-bundles-plugin').DllBundlesPlugin;
const DllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin;
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


/*********************************************************************************************
 *******************************  Imported Webpack Constants/Vars ****************************
 ********************************************************************************************/

const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const webpackConditionals = require('./webpack.conditionals');
const METADATA = webpackConditionals.METADATA;
const outputDir = helpers.paths.outputDir;

/*********************************************************************************************
 ********************************* BEGIN Webpack Configuration *******************************
 *********************************    module.exports object      *****************************
 ********************************************************************************************/

/* This configuration mode outputs assets similar to production mode, but without any minification or compression. Allows easy debugging of production code. No webpack-dev-server */

module.exports = webpackMerge(commonConfig,
   {
      cache: true,


      /**
       * Developer tool to enhance debugging
       *
       * See: http://webpack.github.io/docs/configuration.html#devtool
       * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
       */

      // devtool: 'eval',
      devtool: 'cheap-module-source-map',


      /**
       * Options affecting the output of the compilation.
       *
       * See: http://webpack.github.io/docs/configuration.html#output
       */
      output: {

         /**
          * The output directory as absolute path (required).
          *
          * See: http://webpack.github.io/docs/configuration.html#output-path
          */
         path: helpers.root(outputDir),

         /**
          * Specifies the name of each output file on disk.
          * IMPORTANT: You must not specify an absolute path here!
          *
          * See: http://webpack.github.io/docs/configuration.html#output-filename
          */
         filename: 'js/[name].bundle.js',

         /**
          * The filename of the SourceMaps for the JavaScript files.
          * They are inside the output.path directory.
          *
          * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
          */
         sourceMapFilename: 'js/maps/[name].map',

         /** The filename of non-entry chunks as relative Path
          * inside the output.Path directory.
          *
          * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
          */
         chunkFilename: 'js/chunks/[name].chunk.js',

         /**
          * Location of hot updates using webpack --watch mode
          */
         hotUpdateChunkFilename: 'js/chunks/hot/hot-update.js',
         hotUpdateMainFilename: 'js/chunks/hot/hot-update.json',
      },

      plugins: [

         /**
          * Plugin: NamedModulesPlugin (experimental)
          * Description: Uses file names as module name.
          *
          * See: https://github.com/webpack/webpack/commit/a04ffb928365b19feb75087c63f13cadfc08e1eb
          */
         new NamedModulesPlugin(),


         new ExtractTextPlugin({
            filename: '/css/[name].style.css?[hash]',
            disable: false,
            allChunks: true
         })

      ], // end plugins

      /*
       * Include polyfills or mocks for various node stuff
       * Description: Node configuration
       *
       * See: https://webpack.github.io/docs/configuration.html#node
       */
      node: {
         global: true,
         crypto: "empty",
         process: true,
         module: false,
         clearImmediate: false,
         setImmediate: false
      }

   });
