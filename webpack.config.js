const path = require('path');
const webpack = require('webpack'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: { //可配置多个入口,  __dirname为nodejs中变量，指向当前执行脚本目录
    index: __dirname + "/src/index.js",  
    foo: __dirname + "/src/foo.js",
    //bar: './src/page-bar.js',
  },   
  output: {
    //filename: "[name]-[chunkhash].js", //打包后输出文件的文件名,与热加载插件冲突,chunkhash根据内容生成文件名，
    filename: "[name]-[hash].js", //打包后输出文件的文件名，hash，同一次hash值相同。
    path: path.resolve(__dirname, 'dist') //path.resolve总是返回一个以相对于当前的工作目录的绝对路径。
  },

  module: {
    rules: [
      {
        test: /\.css/,
        include: [ //匹配特定路径
          path.resolve(__dirname, 'src'),
        ],
        use: ExtractTextPlugin.extract({  //loader顺序从下向上，经过css, 然后style
          fallback: 'style-loader', //会将css-loader解析的结果转变成JS代码，运行时动态插入style标签来让CSS代码生效。
          use: [{
            loader: 'css-loader', //负责解析CSS代码，主要处理 CSS 中的依赖，例如 @import 和 url() 等引用外部文件的声明
            options: {
              minimize: true, // 使用 css 的压缩功能
            },
          }]  
        }),
      },
      {
        test: /.*\.(gif|png|jpe?g|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader', //file-loader可以用于处理很多类型的文件，它的主要作用是直接输出文件，把构建后的文件路径返回。
            options: {},
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { // 压缩 jpeg 的配置
                progressive: true,
                quality: 65
              },
              optipng: { // 使用 imagemin-optipng 压缩 png，enable: false 为关闭
                enabled: false,
              },
              pngquant: { // 使用 imagemin-pngquant 压缩 png
                quality: '65-90',
                speed: 4
              },
              gifsicle: { // 压缩 gif 的配置
                interlaced: false,
              },
              webp: { // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
                quality: 75
              },
            },
          },  
        ],
      },
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader",
          options: { 
            presets: [ //启动什么样的预设转码
              "env", "react"
            ]
          }
        },
        exclude: /node_modules/ //排除特定路径
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({  //利用html模板,自动引用js
      template: __dirname + "/src/index.html",
      filename: __dirname + '/dist/index.html',
      minify: {
        minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
        minifyJS: true  // 压缩 HTML 中出现的 JS 代码
      }
    }),
    new ExtractTextPlugin('[name].css'), //css单独提取
    new webpack.DefinePlugin({ //创建编译时可配置的全局变量
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify('5fa3b9'),
      TWO: '1+1',
    }),
    new CopyWebpackPlugin([ 
      { from: 'src/file.txt', to: 'file.txt', }, //from 配置来源，to 配置目标路径
    ]),
    new webpack.ProvidePlugin({ //引用某些模块作为应用运行时的变量
      identifier: 'module', //当 identifier 被当作未赋值的变量时，module 就会被自动加载了，而 identifier 这个变量即 module 对外暴露的内容。
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), //忽略部分模块,这些将不会被打包
    new webpack.NamedModulesPlugin(), // 用于启动 HMR 时可以显示模块的相对路径
    new webpack.HotModuleReplacementPlugin(), // Hot Module Replacement 的插件,增强版热加载，只加载需要加载的部分
  ],

  resolve: {  //模块路径解析相关配置
    alias: {
      utils$: path.resolve(__dirname, 'src/utils') // 这里使用 path.resolve 和 __dirname 来获取绝对路径, 
                                                  //精确匹配，import 'utils/query.js'，则会自动替换掉 utils
    },
    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'], //导入文件时，可以不写后缀名，会自动根据这里进行补全查找，前面的优先级高
    modules: [
      path.resolve(__dirname, 'node_modules'), // 指定当前目录下的 node_modules 优先查找
      'node_modules', // 如果有一些类库是放在一些奇怪的地方的，你可以添加自定义的路径或者目录...
    ],
  },

  devServer: { //配置 webpack-dev-server,当指定开发环境，则有热加载功能
    //public: "", //配置域名
    // publicPath: "", //用于指定构建好的静态文件在浏览器中用什么路径去访
    proxy: { //用于配置 webpack-dev-server 将特定 URL 的请求代理到另外一台服务器上
      '/api': {
        target: "http://localhost:3000", // 将URL中带有 /api 的请求代理到本地的 3000 端口的服务上
        pathRewrite: { '^/api': '' }, // 把URL中path部分的 `api` 移除掉
      },
    },
    //contentBase: path.join(__dirname, "public"), //用于配置提供额外静态文件内容的目录，优先级低于publicPath
    hot: true, //开启热加载
  },
  
}
