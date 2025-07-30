module.exports = {
      plugins: {
            tailwindcss: {},
            // 使用 cnjm-postcss-px-to-viewport 规避 postcss.plugin was deprecated 警告
            'cnjm-postcss-px-to-viewport': {
                  viewportWidth: 375, // 根据设计稿设定
                  minPixelValue: 1, // 最小的转换数值
                  unitPrecision: 2, // 转化精度，转换后保留位数
                  viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
                  fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
            },
            // 'postcss-pxtorem': {
            //       // 判断是否是vant的文件 如果是就使用 37.5为根节点字体大小
            //       rootValue({ file }) {
            //             // 否则使用75，因为vant使用的设计标准为375 但市场现在的主流设置尺寸是750
            //             return 37.5
            //       },
            //       // 配置的文件尺寸需要转化为rem *表示所有的都要转化
            //       // 需要转换的css属性，默认*全部
            //       propList: ['*'],
            // },

            autoprefixer: {
                  overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7'],
            },
      },
}
