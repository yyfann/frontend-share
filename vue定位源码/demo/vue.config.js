const path = require('path')

const addElementLocationLoader = path.resolve(__dirname, './open-source/add-element-location-loader.js')

module.exports = {
  devServer: {
    port: 8700,
    ...require("./open-source/server")
  },
  chainWebpack: config => {
    // ...
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.exposeFilename = true
        return options
      })
      .end()
      .use(addElementLocationLoader)
      .loader(addElementLocationLoader)
      .end()
  },
}