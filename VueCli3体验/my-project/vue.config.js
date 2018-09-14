const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  assetsDir: 'static', // 存放打包以后的js, css, img
  // indexPath: 'a.html' // 指定打包以后的html默认为index.html
  filenameHashing: false, // 配置打包后的js, css, img的文件名后面是否跟一串哈希值, 默认为true
  // pages: ''   在构建多页面应用时为每一个页面添加一个对应的js入口文件
  lintOnSave: true, // 处理eslint报错, 默认为true这样是会将错误以警告的方式输出到控制台，设置为false时则会中断代码编译
  runtimeCompiler: true, // 是否在项目中可以使用template模板, 为false时使用render函数
  // transpileDependencies: [],   babel-loader转化时是否忽略node_modules
  productionSourceMap: false, // 代码打包后不生成.map文件, 提高打包效率
  chainWebpack: (config) => {
    config.resolve.alias // 配置alias别名
      .set('views', resolve('src/views'))
      .end()
  }
}
