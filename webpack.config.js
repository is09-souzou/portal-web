const { DefinePlugin }        = require ("webpack")
const path                    = require("path");
const convert                 = require('koa-connect');
const history                 = require('connect-history-api-fallback');
const BundleAnalyzerPlugin    = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin       = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const Uglify                  = require("uglifyjs-webpack-plugin");

module.exports = {
    entry: "./src/index.tsx",
    mode: process.env.NODE_ENV || "production",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/"
    },
    resolve: {
        modules: ["node_modules"],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.(jsx?|tsx?)$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    },
    optimization: (
        process.env.NODE_ENV === "production" ? {
            splitChunks: {
                cacheGroups: {
                react: {
                    test: /node_modules\/react/,
                    name: "react.vendor",
                    chunks: "initial",
                    enforce: true
                },
                awsSdk: {
                    test: /node_modules\/aws-sdk/,
                    name: "aws-sdk.vendor",
                    chunks: "initial",
                    enforce: true
                },
                awsAppsync: {
                    test: /node_modules\/aws-appsync/,
                    name: "aws-appsync.vendor",
                    chunks: "initial",
                    enforce: true
                },
                materialUi: {
                    test: /node_modules\/@material-ui/,
                    name: "material-ui.vendor",
                    chunks: "initial",
                    enforce: true
                }
                }
            }
        }
      :                                         {}
    ),
    plugins: [
        // new Uglify({
            // sourceMap: false,
            // uglifyOptions: {
            //     ecma: 8,
            //     mangle: {
            //         properties: false
            //     },
            //     output: {
            //         // comments: "@license",
            //         beautify: false
            //     },
            // }
        // }),
        // new BundleAnalyzerPlugin(),
        // ...(process.env.NODE_ENV === "development" ? [new HardSourceWebpackPlugin()] : []),
        new DefinePlugin(
            Object.entries(process.env)
                .map(x => ({["process.env." + x[0]]: JSON.stringify(x[1])}))
                .reduce((x, y) => Object.assign(x, y), {}),
        ),
        new HtmlWebpackPlugin({
            hash: true,
            title: "Portal",
            minify: (
                process.env.NODE_ENV === "production" ? {
                    caseSensitive: true,
                    collapseBooleanAttributes: true,
                    collapseInlineTagWhitespace: true,
                    collapseWhitespace: true,
                    decodeEntities: true,
                    preserveLineBreaks: true,
                    useShortDoctype: true
                }
              :                                         false
            ),
            filename: "index.html",
            template: "src/index.html"
        }),
    ],
    serve: {
        add: (app, middleware, options) => {
            app.use(convert(history()));
        },
        content: path.resolve(__dirname, 'assets'),
        open: true
    }
};
