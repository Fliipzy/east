const path = require('path');
const paths = require('./paths');
const pjson = require('../package.json');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        app: paths.main,
    },
    output: {
        path: path.resolve(pjson.config.webfolder),
        filename: './assets/js/[name].js'
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: paths.public, to: path.resolve(pjson.config.webfolder) }
            ],
        }),
        new MiniCssExtractPlugin({
            filename: './assets/css/[name].css',
            chunkFilename: './assets/css/[name].css',
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                include: paths.src,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                          url: false,
                          import: true,
                          sourceMap: true,
                        }
                    },
                ]
            }
        ]
    }
}