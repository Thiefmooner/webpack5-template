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
                                      stage: 3
                                    }
                                  ]
                                ]
                              }
                            }
                        }
                    ]
                },
                /**在webpack5之前我们使用url-loader来加载图片
                 * 在webpack5中我们使用内置的Asset Modules来加载图像资源
                 * 在 webpack 5 之前，通常使用
                 * raw-loader 将文件导入为字符串
                 * url-loader 将文件作为data URI内联到 bundle 中
                 * file-loader 将文件发送到输出目录
                 * webpack5，我们使用资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader： 
                 * asset/resource 发送一个单独的文件并导出 URL，之前通过使用 file-loader 实现
                 * asset/inline 导出一个资源的 data URI，之前通过使用 url-loader 实现
                 * asset/source 导出资源的源代码，之前通过使用 raw-loader 实现
                 * asset 在导出一个 data URI 和发送一个单独的文件之间自动选择，之前通过使用 url-loader，并且配置资源体积限制实现 
                */
                {
                    test:/\.(png|svg|jpg|jpeg|gif)$/,
                    type:'asset',
                    generator:{  //generator用来自定义文件名，与文件存放位置
                        filename:'image/[name].[contenthash:8][ext][query]'
                    }
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