import { isQYWechat } from './util'
import { xsrfHeaderName, AuthType, checkAuthorization } from '@/utils/request'
import { useRouter } from 'vue-router'
const router = useRouter()
// 401拦截
const resp401 = {
      /**
       * 响应数据之前做点什么
       * @param response 响应对象
       * @param options 应用配置 包含: {router, i18n, store, message}
       * @returns {*}
       */
      onFulfilled(response: any, options: any) {
            const { message, store } = options
            if (response.data.code === 401) {
                  if (!isQYWechat()) {
                        message({ message: response.data.msg || response.data.message, type: 'danger' })
                        store.clear().then(() => {
                              setTimeout(() => {
                                    const originUrl = window.location.href
                                    store.login({ currentUrl: originUrl }).then((url: any) => {
                                          window.location.href = url
                                    })
                              }, 1500)
                        })
                  } else {
                        message({ message: '身份过期！', type: 'danger' })
                  }
            } else {
                  // message({ message: '1111', type: 'danger' })
            }
            return response
      },
      /**
       * 响应出错时执行
       * @param error 错误对象
       * @param options 应用配置 包含: {router, i18n, store, message}
       * @returns {Promise<never>}
       */
      onRejected(error: any) {
            return Promise.reject(error)
      },
}
/**
 * 如果是微信环境。退出就关闭窗口
 */

// 403拦截
const resp403 = {
      onFulfilled(response: any, options: any) {
            const { message, store } = options
            if (response.data.code === 403) {
                  message({ message: '用户无权限，请求被拒绝！', type: 'danger' })

                  // if (!isQYWechat()) {
                  //       store.clear().then(() => {
                  //             setTimeout(() => {
                  //                   const originUrl = window.location.href
                  //                   store.login({ currentUrl: originUrl }).then((url: any) => {
                  //                         window.location.href = url
                  //                   })
                  //             }, 1500)
                  //       })
                  // }
            }
            if (response.data.code === 6001) {
                  options.router.push('/403')
            }
            return response
      },
      onRejected(error: any) {
            return Promise.reject(error)
      },
}
// 500 拦截
const resp500 = {
      onFulfilled(response: any, options: any) {
            const { message } = options
            if (response.data.code === 500) {
                  message({ message: '服务器接口异常：' + response.data.msg || response.data.message, type: 'danger' })
            }
            return response
      },
      onRejected(error: any) {
            return Promise.reject(error)
      },
}
const reqCommon = {
      /**
       * 发送请求之前做些什么
       * @param config axios config
       * @param options 应用配置 包含: {router, i18n, store, message}
       * @returns {*}
       */
      onFulfilled(config: any, options: any) {
            const { url } = config
            console.log(url)
            const { store } = options
            if (url.indexOf('user/login') !== -1) {
                  if (isQYWechat()) {
                        config.headers[AuthType] = 'WECHAT'
                  } else {
                        config.headers[AuthType] = 'SSO_NEXT'
                  }
            } else if (url.indexOf('getEnumByCode') !== -1 || url.indexOf('getAllEnumByAppId') !== -1) {
                  config.headers[xsrfHeaderName] = 'hrnem:BVIlvryyQnzkosRFn8yW'
            } else {
                  if (url.indexOf('downloadFile') !== -1 || url.indexOf('previewUploadFile') !== -1) {
                        config.headers[xsrfHeaderName] = `Bearer ${store.getters['account/ptoken']}`
                  } else {
                        // 判断是否存在token，如果存在的话，则每个http header都加上token
                        if (checkAuthorization()) {
                              config.headers[xsrfHeaderName] = store.Authorization
                        }
                  }
                  config.headers['project'] = 'manage'
            }
            if (config.method === 'get') {
                  config.params = { ...config.params, timestamp: Date.now() }
            }
            return config
      },
      /**
       * 请求出错时做点什么
       * @param error 错误对象
       * @param options 应用配置 包含: {router, i18n, store, message}
       * @returns {Promise<never>}
       */
      onRejected(error: any, options: any) {
            const { message } = options
            message({ message: error.data.msg ? error.data.msg : '请求参数设置异常，请稍后重试！', type: 'danger' })
            return Promise.reject(error)
      },
}

const resp200 = {
      async onFulfilled(response: any, options: any) {
            const { message, router } = options
            if (response.status === 200 || response.status === 202) {
                  if (!(response.data instanceof Blob) && !(response.data instanceof ArrayBuffer)) {
                        if (response.data.code === 401 || response.data.code === 403 || response.data.code === 500) return Promise.reject(response)
                        if (
                              response.data.code !== 'SUCCESS' &&
                              response.data.status !== 200 &&
                              response.data.code !== '20000' &&
                              response.data.code !== 0 &&
                              response.data.code !== 20220 &&
                              response.data.code !== 20000 &&
                              response.data.code !== 200
                        ) {
                              if (response.data.msg && response.data.msg.indexOf('</br>') !== -1) {
                                    message.error({ content: (h: any) => h('span', { domProps: { innerHTML: response.data.msg } }) })
                              } else {
                                    // message({ message: '服务器接口异常，请稍后再试', type: 'danger' })
                                    message({ message: response.data.msg ? response.data.msg : '服务器接口异常，请稍后再试', type: 'danger' })
                              }
                              return Promise.reject(response)
                        }
                        return Promise.resolve(response.data)
                  } else {
                        return Promise.resolve(response)
                  }
            } else {
                  message({ message: response.data.msg ? response.data.msg : '服务器接口异常，请稍后再试', type: 'danger' })
                  return Promise.reject(response)
            }
      },
      onRejected(error: any, options: any) {
            const { message } = options
            message({ message: error.message ? error.message : '服务器接口异常，请稍后再试', type: 'danger' })
            return Promise.reject(error)
      },
}

export default {
      request: [reqCommon], // 请求拦截
      response: [resp401, resp403, resp500, resp200], // 响应拦截
}
