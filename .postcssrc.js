module.exports = {
  plugins: {
    //   'autoprefixer': {
    //     browsers: ['Android >= 4.0', 'iOS >= 8']
    //   },  vuecli 内部配置了 兼容
    // 如果你使用的是基于 lib-flexable 的 REM 适配方案，则应该设置为你的设计稿的十分之一。
    // 例如设计稿是 750 宽，则应该设置为 75。
    'postcss-pxtorem': {
      rootValue({ file }) {
        return file.includes('vant') ? 37.5 : 75
      },
      propList: ['*'],
      // 配置不要转换的样式资源
      exclude: 'git-markdown'
    }
  }
}
