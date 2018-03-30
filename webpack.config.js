const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

require('./builder')

module.exports = {
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './assets/images/favicon.png'
        }),
        new webpack.ProvidePlugin({
            PIXI: 'pixi.js'
        })
    ],
    resolve: {
        alias: {
            '@modules': path.resolve(__dirname, './modules')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
}
