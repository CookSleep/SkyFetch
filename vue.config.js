const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/SkyFetch/'
    : '/',
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].minify = false
      return args
    })
  },
  css: {
    loaderOptions: {
      css: {
        url: {
          filter: (url) => {
            // 确保字体文件被正确处理
            if (url.includes('.ttf')) {
              return false;
            }
            return true;
          },
        },
      },
    },
  },
})