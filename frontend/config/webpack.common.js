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

const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const helpers = require('./helpers.js');
const webpackConditionals = require('./webpack.conditionals');
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
    extensions: ['.ts', '.js', '.scss', '.css', '.html', '.json']
  },
  entry: {
    app: './src/app-components/app/app.bootstrap.ts'
  },
  module: {
    loaders: [
      {
        test: /\.(scss)$/,
        use:
          isDevServer ? [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
                options: { sourceMap: true }
              },
              {
                loader: 'postcss-loader',
                options: { postcss: [AutoPrefixer(autoPrefixerOptions)], sourceMap: true }
              },
              {
                loader: 'sass-loader',
                options: { sourceMap: true }
              },
              {
                loader: 'sass-resources-loader',
                options: {
                  resources: [
                    './src/assets/styles/variables.scss',
                    './src/assets/styles/mixins.scss']
                }
              },
              /**
               * The sass-vars-loader will convert the 'vars' property or any module.exports of
               * a .JS or .JSON file into valid SASS and append to the beginning of each
               * .scss file loaded.
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
              }] : // dev mode
          ExtractTextPlugin.extract({
            fallback: "css-loader",
            use: [
              {
                loader: 'css-loader',
                options: { sourceMap: true }
              },
              {
                loader: 'postcss-loader',
                options: { postcss: [AutoPrefixer(autoPrefixerOptions)], sourceMap: true }
              },
              {
                loader: 'sass-loader',
                options: { sourceMap: true }
              },
              {
                loader: 'sass-resources-loader',
                options: {
                  resources: [
                    './src/assets/styles/variables.scss',
                    './src/assets/styles/mixins.scss']
                }
              }, {
                loader: '@epegzz/sass-vars-loader?',
                options: querystring.stringify({
                  vars: JSON.stringify({
                    susyIsDevServer: susyIsDevServer
                  })
                  // // Or use 'files" object to specify vars in an external .js or .json file
                  // files: [
                  //    path.resolve(helpers.paths.appRoot + '/assets/styles/sass-js-variables.js')
                  // ],
                })
              }],
            publicPath: '/' // 'string' override the publicPath setting for this loader
          })
      },
      { test: /\.css$/, loader: 'raw-loader' },
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.ts$/, loader: ['@ngtools/webpack'] }
    ]
  },
  plugins: [

    new ngToolsWebpack.AotPlugin({
      tsConfigPath: './tsconfig.aot.json'
    }),

    new ProgressBarPlugin({
      format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
      clear: false
    }),

    /**
     * Plugin: webpack-dll-bundles-plugin
     * Description: Compiles DLL files as part of the build process. Checks if DLLs are already compiled and contain the same version packages, if so, skips compilation. Monitors for changes in packages and builds the bundles accordingly.
     *
     * See: https://github.com/shlomiassaf/webpack-dll-bundles-plugin
     */

    // new DllBundlesPlugin({
    //   bundles: {
    //     polyfills: [
    //       'core-js',
    //       'ts-helpers'
    //     ],
    //     vendors: [
    //       '@angular/platform-browser',
    //       '@angular/platform-browser-dynamic',
    //       '@angular/core',
    //       '@angular/common',
    //       '@angular/forms',
    //       '@angular/http',
    //       '@angular/router',
    //       '@angularclass/hmr',
    //       'rxjs',
    //       'jwt-decode'
    //     ]
    //   },
    //   dllDir: helpers.root(outputDir + '/dlls'),
    //   // bundleExtension: '.dll.bundle.js',
    //   sourceMapFilename: '/maps/[name].map',
    //   chunkFilename: '/chunks/[name].chunk.js',
    //
    //   webpackConfig: webpackMergeDll(commonConfig, {
    //     devtool: 'cheap-module-source-map',
    //     plugins: [ // These plugins are for the DLL build only, will not be used in dev or production builds.
    //
    //       new OptimizeJsPlugin({
    //         sourceMap: false // prod
    //       }),
    //
    //       new UglifyJsPlugin({
    //         // DLLS is build in "Production" mode always, since it is not code I will be debugging (that's why its in the DLL bundle anyway)
    //         beautify: false, //prod
    //         output: {
    //           comments: false
    //         }, //prod
    //         mangle: {
    //           screw_ie8: true
    //         }, //prod
    //         compress: {
    //           screw_ie8: true,
    //           warnings: false,
    //           conditionals: true,
    //           unused: true,
    //           comparisons: true,
    //           sequences: true,
    //           dead_code: true,
    //           evaluate: true,
    //           if_return: true,
    //           join_vars: true,
    //           negate_iife: false // we need this for lazy v8
    //         },
    //         comments: false, //prod
    //         sourceMap: false //prod
    //       }),
    //
    //       new ExtractTextPlugin({
    //         filename: '/css/[name].style.css?[hash]',
    //         disable: false,
    //         allChunks: true
    //       }),
    //
    //       new webpack.DllPlugin({
    //         // The path to the manifest file which maps between
    //         // modules included in a bundle and the internal IDs
    //         // within that bundle
    //         path: helpers.root(outputDir + '/dlls/[name]-manifest.json'),
    //
    //         // The name of the global variable which the library's
    //         // require function has been assigned to. This must match the
    //         // output.library option above
    //         name: '[name]_lib'
    //
    //       }),
    //
    //       new webpack.optimize.CommonsChunkPlugin({
    //         name: ['polyfills', 'vendors'].reverse()
    //       }),
    //
    //       new CompressionPlugin({
    //         asset: "[path].gz",
    //         test: /\.(css|html|js|json|map)(\?{0}(?=\?|$))/,
    //         threshold: 2 * 1024,
    //         algorithm: "gzip",
    //         minRatio: 0.8
    //       })
    //
    //     ]
    //   })
    // }),

    new AssetsPlugin({
      path: helpers.root(`./${outputDir}/js`),
      filename: 'webpack.assets.json',
      prettyPrint: true
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['polyfills', 'vendors'].reverse()
    }),

    new webpack.optimize.CommonsChunkPlugin('commons'),

    // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
    new webpack.DefinePlugin({
      'ENV': JSON.stringify(METADATA.ENV),
      'HMR': METADATA.HMR,
      'AOT': AOT,
      'JIT': JIT,
      'process.env': {
        'ENV': JSON.stringify(METADATA.ENV),
        'NODE_ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR
      }
    }),

    /**
     * Plugin: ChunkManifestPlugin
     * Description: Allows exporting a JSON file that maps chunk ids to their resulting asset files. Webpack can then read this mapping, assuming it is provided somehow on the client, instead of storing a mapping (with chunk asset hashes) in the bootstrap script, which allows to actually leverage long-term caching.
     *
     * See: https://github.com/diurnalist/chunk-manifest-webpack-plugin
     */
    // new ChunkManifestPlugin({
    //    filename: 'manifest.json',
    //    manifestVariable: 'webpackManifest'
    // }),
    // /**
    //  * Plugin: HtmlWebpackPlugin
    //  * Description: Simplifies creation of HTML files to serve your webpack bundles.
    //  * This is especially useful for webpack bundles that include a hash in the filename
    //  * which changes every compilation.
    //  *
    //  * This injects the webpack bundles into your main *.html/**.cshtml document which the browser loads
    //  *
    //  * See: https://github.com/ampedandwired/html-webpack-plugin
    //  */
    // new HtmlWebpackPlugin({
    //    template: 'src/index.html',
    //    chunksSortMode: 'dependency',
    //    hash: true, // creates ?[hash], such as: main.bundle.js?62cd29765a7e959d0fe5
    //    filename: 'index.html',
    //    environment: ENV
    // }),

    /**
     * Plugin: AddAssetHtmlPlugin
     * Description: Adds the given JS or CSS file to the files
     * Webpack knows about, and put it into the list of assets
     * html-webpack-plugin injects into the generated html.
     *
     * Used for DllBundlesPlugin
     *
     * See: https://github.com/SimenB/add-asset-html-webpack-plugin
     */

    new AddAssetHtmlPlugin([
      { filepath: helpers.root(`${outputDir}/dlls/polyfills.dll.bundle.js`) },
      { filepath: helpers.root(`${outputDir}/dlls/vendors.dll.bundle.js`) }
    ]),

    // new webpack.DllReferencePlugin({
    //    context: '.',
    //    // manifest: helpers.root(`${outputDir}/dlls/polyfills-manifest.json`),
    //    manifest: require(helpers.root(`${outputDir}/dlls', 'polyfills-manifest.json`)),
    //
    // }),
    //
    // new webpack.DllReferencePlugin({
    //    context: '.',
    //    // manifest: helpers.root(`${outputDir}/dlls/vendors-manifest.json`),
    //    manifest: require(helpers.root(`${outputDir}/dlls', 'vendors-manifest.json`)),
    // }),

    new CopyWebpackPlugin(
      [
        {
          from: 'src/assets',
          to: 'assets',
          force: true
        }],
      {
        copyUnmodified: false,
        ignore: ['styles/**']
      }),

    new webpack.ProvidePlugin({
      'Promise': 'imports-loader?this=>global!exports-loader?global.Promise!es6-promise-loader',
      // 'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
      // 'tinymce': 'imports?tinymce=>window.tinymce!exports-loader?window.tinymce!tinymce/tinymce.min.js',
      // 'jQuery': 'jquery',
      // '$': 'jquery',
      '_': 'lodash'

    })
  ],
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
  console.log("            helpers.paths.root: " + helpers.paths.root);
  console.log("            outputDir: " + helpers.root(outputDir));

} else {
  console.log("            NODE_ENV not set!");
}
console.log("==================================================\n \n");