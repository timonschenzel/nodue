let webpack = require('webpack');
let path = require('path');
let fs = require('fs');

let inProduction = (process.env.NODE_ENV === 'production');

let layoutFiles = fs.readdirSync('./resources/layouts').filter(function(file) {
    return file.match(/.*\.vue.layout$/);
});

layoutFiles = layoutFiles.map(entry => {
    return `./resources/layouts/${entry}`;
});

let ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        // layout: layoutFiles,
        app: [
            './Nodue/src/Frontend/app.js',
            './resources/assets/sass/app.sass',
        ],
        vendor: ['vue'],
    },

    output: {
        path: path.resolve(__dirname, './public/js'),
        filename: '[name].js',
    },

    context: __dirname,
    
    node: {
        __filename: true
    },

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                    fallback: 'style-loader',
                }),
            },

            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },

            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },

            {
                test: /\.s[ac]ss$/,
                exclude: /node_modules/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },

            {
                test: /\.html$/,
                loaders: ['html-loader']
            },

            {
                test: /\.vue.layout$/,
                exclude: /node_modules/,
                loaders: [path.join(__dirname, 'layoutCompiler.loader')],
            },

            {
                enforce: 'post',
                test: /\.vue.layout$/,
                exclude: /node_modules/,
                loaders: [path.join(__dirname, 'layoutCompiler.loader')],
                loaders: [path.join(__dirname, 'postLayoutCompiler.loader')]
            },
        ]
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js',
        }
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
        }),
        new ExtractTextPlugin('style.css'),
        new webpack.LoaderOptionsPlugin({
            minimize: inProduction,
        }),
    ],
}

if (inProduction) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            sourcemaps: true,
            compress: {
                warnings: false,
            }
        })
    );
}



// module.exports = { context: '/Users/Timon/Projects/nodue',
//     entry: {
//         'public/js/app':
//         [
//             '/Users/Timon/Projects/nodue/resources/assets/js/app.js',
//             '/Users/Timon/Projects/nodue/resources/assets/sass/app.sass'
//         ]
//     },
//     output: {
//         path: './',
//         filename: '[name].js',
//         publicPath: './'
//     },
//     module: {
//         rules:
//         [
//             {
//                 test: /\.vue$/,
//                 loader: 'vue-loader',
//                 options: {
//                     loaders: {
//                         js: 'babel-loader?{"cacheDirectory":true,"presets":[["es2015",{"modules":false}]]}',
//                         scss: 'vue-style-loader!css-loader!sass-loader',
//                         sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
//                         stylus: 'vue-style-loader!css-loader!stylus-loader?paths[]=node_modules'
//                     },
//                     postcss: Mix.options.postCss
//                 }
//             },
//             {
//                 test: /\.jsx?$/,
//                 exclude: /(node_modules|bower_components)/,
//                 loader: 'babel-loader?{"cacheDirectory":true,"presets":[["es2015",{"modules":false}]]}'
//             },
//             {
//                 test: /\.css$/,
//                 loaders: [ 'style-loader', 'css-loader' ]
//             },
//             {
//                 test: /\.s[ac]ss$/,
//                 include: /node_modules/,
//                 loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
//             },
//             {
//                 test: /\.html$/,
//                 loaders: [ 'html-loader' ]
//             },
//             {
//                 test: /\.(png|jpe?g|gif)$/,
//                 loader: 'file-loader',
//                 options: { name: 'images/[name].[ext]?[hash]', publicPath: '/' }
//             },
//             {
//                 test: /\.(woff2?|ttf|eot|svg|otf)$/,
//                 loader: 'file-loader',
//                 options: { name: 'fonts/[name].[ext]?[hash]', publicPath: '/' }
//             },
//             {
//                 test: /\.(cur|ani)$/,
//                 loader: 'file-loader',
//                 options: { name: '[name].[ext]?[hash]', publicPath: '/' }
//             },
//         ]
//     },
//     plugins:
//     [
//         ExtractTextPlugin {
//             filename: 'public/css/app.css',
//             id: 1, options: {}
//         },
//         ProvidePlugin {
//             definitions: [Object]
//         },
//         FriendlyErrorsWebpackPlugin {
//             compilationSuccessInfo: {},
//             onErrors: undefined,
//             shouldClearConsole: true,
//             formatters: [Object],
//             transformers: [Object]
//         },
//         StatsWriterPlugin {
//             opts: [Object]
//         },
//         WebpackMd5Hash {},
//         LoaderOptionsPlugin {
//             options: [Object]
//         },
//         {
//             options: [Object],
//             lastBuildSucceeded: false,
//             isFirstBuild: true
//         },
//         WebpackOnBuildPlugin { callback: [Function] }
//     ],
//     resolve: {
//         extensions: [ '*', '.js', '.jsx', '.vue' ],
//         alias: {
//             'vue$': 'vue/dist/vue.common.js' }
//         },
//     stats: {
//         hash: false,
//         version: false,
//         timings: false,
//         children: false,
//         errors: false
//     },
//     performance: {
//         hints: false
//     },
//     devtool: false,
//     devServer: {
//         historyApiFallback: true,
//         noInfo: true,
//         compress: true,
//         quiet: true
//     }
// };