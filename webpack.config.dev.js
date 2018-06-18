const { DefinePlugin } = require ("webpack")
const path             = require("path");
const convert          = require('koa-connect');
const history          = require('connect-history-api-fallback');

module.exports = {
    entry: "./src/index.tsx",
    mode: "development",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
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
        new DefinePlugin(
            Object.entries(process.env)
                .map(x => ({["process.env." + x[0]]: JSON.stringify(x[1])}))
                .reduce((x, y) => Object.assign(x, y), {}),
        )
    ],
    serve: {
        add: (app, middleware, options) => {
            app.use(convert(history()));
        },
        content: path.resolve(__dirname, 'assets'),
        open: true
    }
};
