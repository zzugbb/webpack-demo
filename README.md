# webpack-demo

![](https://img.shields.io/badge/language-javascript-red.svg)
![](https://img.shields.io/badge/license-MIT-blue.svg)
![](https://img.shields.io/badge/repo%20size-38kb-green.svg)

`webpack` 练习~~~~

## 使用

1. 工程克隆
2. cd webpack-demo && npm install
3. npm run build || yarn build  //webpack打包，直接打开dist下目录即可查看。
4. npm run start || yarn start  //启动内置server，访问http://localhost:8080/
5. node app.js //启动服务端   //启动服务端，访问http://localhost:3000/

## 说明

* 对于上述第三，直接打包，可以访问生成后的静态页面 /dist/index.html
* 对于上述第四，启动 `webpack-dev-server`, 可以进行开发，且有热更新。
* 对于上述第五，启动 `node` 服务器，采用了 `webpack-dev-middleware`.
* `webpack-dev-middleware`: Express中提供 webpack-dev-server 静态服务能力的一个中间件。
