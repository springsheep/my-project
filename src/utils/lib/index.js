/*
 * @Descripttion: ----描述----
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2022-10-31 10:32:22
 * @LastEditors: shilihong
 * @LastEditTime: 2023-10-30 17:44:01
 */
/**
 * @Author: zuojt
 * @Email: zuo.jiangtao@h3c.com
 * @Date: 2022-09-14 10:07:58
 * @version: 1.0.3
 * */
import request from './utils/request'

/**
 * 获取操作系统
 */

function getOperationSystem() {
      var OS = ''
      var OSArray = {}
      var UserAgent = navigator.userAgent.toLowerCase()
      OSArray.Windows = navigator.platform === 'Win32' || navigator.platform === 'Windows'
      OSArray.Mac = navigator.platform === 'Mac68K' || navigator.platform === 'MacPPC' || navigator.platform === 'Macintosh' || navigator.platform === 'MacIntel'
      OSArray.iphone = UserAgent.indexOf('iPhone') > -1
      OSArray.ipod = UserAgent.indexOf('iPod') > -1
      OSArray.ipad = UserAgent.indexOf('iPad') > -1
      OSArray.Android = UserAgent.indexOf('Android') > -1

      for (var i in OSArray) {
            if (OSArray[i]) {
                  OS = i
            }
      }

      return OS
}
/**
 * 获取浏览器信息
 */

function getBrowser() {
      var UserAgent = navigator.userAgent.toLowerCase()
      var browser = null
      var browserArray = {
            IE: window.ActiveXObject || 'ActiveXObject' in window,
            // IE
            Chrome: UserAgent.indexOf('chrome') > -1 && UserAgent.indexOf('safari') > -1,
            // Chrome浏览器
            Firefox: UserAgent.indexOf('firefox') > -1,
            // 火狐浏览器
            Opera: UserAgent.indexOf('opera') > -1,
            // Opera浏览器
            Safari: UserAgent.indexOf('safari') > -1 && UserAgent.indexOf('chrome') === -1,
            // safari浏览器
            Edge: UserAgent.indexOf('edge') > -1,
            // Edge浏览器
            QQBrowser: /qqbrowser/.test(UserAgent),
            // qq浏览器
            WeixinBrowser: /MicroMessenger/i.test(UserAgent), // 微信浏览器
      }

      for (var i in browserArray) {
            if (browserArray[i]) {
                  browser = i
            }
      }

      return browser
}
/**
 * 获取浏览器版本号
 */

function getBrowserVersion() {
      var UserAgent = navigator.userAgent.toLowerCase()
      var re = new RegExp('msie ([0-9]+)')
      var re11 = new RegExp('rv:([0-9]+)')
      var ver = null

      if (re.exec(UserAgent) != null) {
            // console.log(RegExp.$1);
            ver = RegExp.$1
      } else {
            // IE11
            if (re11.exec(UserAgent) != null) {
                  ver = RegExp.$1
            }
      }

      return ver
}

var API = {
      statisticsUrl: '/appstatistics/v1.0/record/add_get',
} // 访问统计

const accessCount = function (props) {
      console.log('accessCount', props)
      let params = {
            operatingSystem: getOperationSystem(),
            browser: getBrowser(),
            browserVersion: getBrowserVersion(),
            url: window.location.href,
            pageTitle: document.title,
            referrer: document.referrer,
            ip: '',
            recordTime: '',
            recordTimeHour: '',
            ...props,
      }
      request({
            // API 请求的默认前缀
            baseURL: '//api.eos.h3c.com',
            url: API.statisticsUrl,
            method: 'GET',
            params: params,
      })
}
export { accessCount }
