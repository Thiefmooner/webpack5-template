/**公用配置*/

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
            rules:[
                {
                    test:/.css$/i,
                    use:[
                        "style-loader",
                        "css-loader",
                        {
                            loader: 'postcss-loader',  //css用来兼容浏览器的处理
                            options: {
                              postcssOptions: {
                                plugins: [
                                  [
                                    'postcss-preset-env',  //postcss里，使用postcss-preset-env插件来自动添加前缀
                                    {
                                      autoprefixer: {
                                        flexbox: 'no-2009',
                                      },
                                      stage: 3,
                                    },
                                  ],
                                ],
                              },
                            }
                        },
                    ]
                }
            ]
        },
        plugins:[
            new HtmlWebpackPlugin({  //HtmlWebpackPlugin的使用：直接new在plugins即可
                template: path.resolve(__dirname,'../public/index.ejs') //插件中引入模板index.ejs,让html-webpack-plugin根据模板文件生成html文件
            }),
        ]
    }
}