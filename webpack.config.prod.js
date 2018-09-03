const { DefinePlugin }     = require ("webpack")
const path                 = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Uglify               = require("uglifyjs-webpack-plugin");

module.exports = {
    entry: "./src/index.tsx",
    mode: "production",
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
    plugins: [
        new Uglify({
            uglifyOptions: {
                ecma: 8,
                mangle: {
                    properties: {
                        builtins: false,
                        debug: false,
                        keep_quoted: false
                    }
                },
                output: {
                    comments: false,
                    beautify: false
                },
            }
        }),
        // new BundleAnalyzerPlugin(),
        new DefinePlugin(
            Object.entries(process.env)
                .map(x => ({["process.env." + x[0]]: JSON.stringify(x[1])}))
                .reduce((x, y) => Object.assign(x, y), {}),
        )
    ]
};
