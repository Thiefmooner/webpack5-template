const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { webpack } = require('webpack');

module.exports = (webpackEnv) => {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';
    return {
        mode:webpackEnv,
        entry:'./src/index.js',
        output:{
            filename:'main.js',
            path:path.resolve(__dirname,'dist')
        },
        module:{
            rules:[]
        },
        plugins:[
            new HtmlWebpackPlugin({  //HtmlWebpackPlugin的使用：直接new在plugins即可
                template: path.resolve(__dirname,'../public/index.ejs') //插件中引入模板index.ejs,让html-webpack-plugin根据模板文件生成html文件
            }),
        ]
    }
}