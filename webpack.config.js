const UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
    path = require("path");

module.exports = {
    entry:{
        index:"./src/index"
    },
    output:{
        library: 'InfRecursion',
        libraryTarget: 'umd',
        libraryExport: 'default',
        filename: 'InfRecursion.js',
        path: path.resolve(__dirname,'dist')
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/preset-env']
                    }
                }
            }
        ]
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()]
    }
};