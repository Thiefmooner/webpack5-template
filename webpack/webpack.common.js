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
                            },
                            /**
                             * css modules(直接在css-loader中添加modules属性即可)
                             * 对属性名通过hash值或者路径字符串的形式进行重命名
                             * 保证每个属性名都是唯一添加modules属性 
                             */
                            modules: {
                                localIdentName: '[hash:base64:8]',
                              }

                        }
                    ]
                },
                /** 在webpack5之前我们使用url-loader来加载图片
                 *  在webpack5中我们使用内置的Asset Modules来加载图像资源
                 *  在 webpack 5 之前，通常使用
                 *  raw-loader 将文件导入为字符串
                 *  url-loader 将文件作为data URI内联到 bundle 中
                 *  file-loader 将文件发送到输出目录
                 *  webpack5，我们使用资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader
                 *  asset/resource 发送一个单独的文件并导出 URL，之前通过使用 file-loader 实现
                 *  asset/inline 导出一个资源的 data URI，之前通过使用 url-loader 实现
                 *  asset/source 导出资源的源代码，之前通过使用 raw-loader 实现
                 *  asset 在导出一个 data URI 和发送一个单独的文件之间自动选择，之前通过使用 url-loader，并且配置资源体积限制实现 
                 */
                {
                    test:/\.(png|svg|jpg|jpeg|gif)$/,
                    type:'asset',
                    generator:{  //generator用来自定义文件名，与文件存放位置
                        filename:'image/[name].[contenthash:8][ext][query]'
                    }
                },
                {
                    exclude: /\.(js|mjs|ejs|jsx|ts|tsx|css|scss|sass|png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',   //通过排除其他资源的后缀名,来加载fonts字体或者其他资源
                },
                {
                    test: /\.js$/,
                    include: path.resolve(__dirname,'./src'),
                    use:[
                        {
                            loader: 'babel-loader',
                            options: {
                                /**
                                 * @babel/preset-env,它是转译插件的集合,所有需要转换的es6特性的插件都集合到babel/preset-env 
                                 */
                                presets:[
                                    "@babel/preset-env",
                                    "@babel/preset-typescript"   //@babel/preset-typescript
                                ],

                                plugins:[
                                    [
                                        /** 通过引入模块的方式来实现polyfill
                                         *  babel只支持最新语法的转换，比如：extends
                                         *  但是它没办法支持最新的Api，比如：Map，Set，Promise等
                                         *  需要在不兼容的环境中也支持最新的Api
                                         *  那么则需要通过polyfill的方式在目标环境中添加缺失的Api
                                         */
                                        '@babel/plugin-transform-runtime',  
                                        {
                                            "helpers": true,  // helpers？？？？没明白
                                            "corejs": 3,  //指定依赖corejs的版本进行polyfill
                                            /**
                                             *  在我们使用generate时，会在全局环境上注入generate的实现函数
                                             *  这样会造成全局污染，将regenerator设置true
                                             *  通过模块引入的方式来调用generate，避免全局污染
                                             */ 
                                            "regenerator": true  
                                        }
                                    ]


                                ]

                            }
                        }
                    ]
                },
                {
                    test: /\.(scss|sass)$/,
                    use: ["sass-loader"],  //添加sass-loader
                },
            
            ]
        },
        plugins:[
            new HtmlWebpackPlugin({  //HtmlWebpackPlugin的使用:直接new在plugins即可
                template: path.resolve(__dirname,'../public/index.ejs') //插件中引入模板index.ejs,让html-webpack-plugin根据模板文件生成html文件
            }),
        ]
    }
}


/**
 * !!!注意！!!
 * package.json里添加如下内容，配置目标浏览器，告诉babel我们要为哪些浏览器进行polyfill
 *   "browserslist": {
 *   "development": [  // 开发时配置，针对较少的浏览器，使polyfill的代码更少，编译更快
 *     "last 1 chrome version",
 *     "last 1 firefox version",
 *     "last 1 safari version"
 *    ],
 *   "production": [  // 生产的配置，需要考虑所有支持的浏览器，支持的浏览器越多，polyfill的代码也就越多
 *     ">0.2%",
 *     "not dead",
 *     "not op_mini all"
 *    ]
 *  }
 */