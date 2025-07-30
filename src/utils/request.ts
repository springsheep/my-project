import axios from 'axios'
import Cookie from 'js-cookie'
// 跨域认证信息 header 名
const xsrfHeaderName = 'Authorization'
const AuthType = 'Auth-Type'
axios.defaults.timeout = 1000 * 60
const httpAxios = axios.create({
      baseURL: '',
})

// 认证类型
const AUTH_TYPE = {
      BEARER: 'Bearer',
      BASIC: 'basic',
      AUTH1: 'auth1',
      AUTH2: 'auth2',
}

// http method
const METHOD = {
      GET: 'get',
      POST: 'post',
      DELETE: 'delete',
      PUT: 'put',
}

/**
 * axios请求
 * @param url 请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>}
 */
async function request(url: any, method: any, params?: any, config?: any) {
      switch (method) {
            case METHOD.GET:
                  return httpAxios.get(url, { params, ...config })
            case METHOD.POST:
                  return httpAxios.post(url, params, config)
            case METHOD.DELETE:
                  return httpAxios.delete(url, { data: params, ...config })
            case METHOD.PUT:
                  return httpAxios.put(url, params, config)
            default:
                  return httpAxios.get(url, { params, ...config })
      }
}

/**
 * 设置认证信息
 * @param auth {Object}
 * @param authType {AUTH_TYPE} 认证类型，默认：{AUTH_TYPE.BEARER}
 */
function setAuthorization(auth: any, authType = AUTH_TYPE.BEARER) {
      switch (authType) {
            case AUTH_TYPE.BEARER:
                  Cookie.set(xsrfHeaderName, auth.token, {
                        expires: new Date(+new Date() + 7.5 * 3600 * 1000),
                  })
                  break
            case AUTH_TYPE.BASIC:
            case AUTH_TYPE.AUTH1:
            case AUTH_TYPE.AUTH2:
            default:
                  break
      }
}

/**
 * 移出认证信息
 * @param authType {AUTH_TYPE} 认证类型
 */
function removeAuthorization(authType = AUTH_TYPE.BEARER) {
      switch (authType) {
            case AUTH_TYPE.BEARER:
                  Cookie.remove(xsrfHeaderName)
                  break
            case AUTH_TYPE.BASIC:
            case AUTH_TYPE.AUTH1:
            case AUTH_TYPE.AUTH2:
            default:
                  break
      }
}

/**
 * 检查认证信息
 * @param authType
 * @returns {boolean}
 */
function checkAuthorization(authType = AUTH_TYPE.BEARER) {
      switch (authType) {
            case AUTH_TYPE.BEARER:
                  if (Cookie.get(xsrfHeaderName)) {
                        return true
                  }
                  break
            case AUTH_TYPE.BASIC:
            case AUTH_TYPE.AUTH1:
            case AUTH_TYPE.AUTH2:
            default:
                  break
      }
      return false
}

/**
 * 加载 axios 拦截器
 * @param interceptors
 * @param options
 */
function loadInterceptors(interceptors: any, options?: any) {
      const { request, response } = interceptors
      // 加载请求拦截器
      request.forEach((item: any) => {
            let { onFulfilled, onRejected } = item
            if (!onFulfilled || typeof onFulfilled !== 'function') {
                  onFulfilled = (config: any) => config
            }
            if (!onRejected || typeof onRejected !== 'function') {
                  onRejected = (error: any) => Promise.reject(error)
            }
            httpAxios.interceptors.request.use(
                  config => onFulfilled(config, options),
                  error => onRejected(error, options),
            )
      })
      // 加载响应拦截器
      response.forEach((item: any) => {
            let { onFulfilled, onRejected } = item
            if (!onFulfilled || typeof onFulfilled !== 'function') {
                  onFulfilled = (response: any) => response
            }
            if (!onRejected || typeof onRejected !== 'function') {
                  onRejected = (error: any) => Promise.reject(error)
            }
            httpAxios.interceptors.response.use(
                  response => onFulfilled(response, options),
                  error => onRejected(error, options),
            )
      })
}

/**
 * 解析 url 中的参数
 * @param url
 * @returns {Object}
 */
function parseUrlParams(url: any) {
      const params: any = {}
      if (!url || url === '' || typeof url !== 'string') {
            return params
      }
      const paramsStr = url.split('?')[1]
      if (!paramsStr) {
            return params
      }
      const paramsArr: any = paramsStr.replace(/&|=/g, ' ').split(' ')
      for (let i = 0; i < paramsArr.length / 2; i++) {
            const value = paramsArr[i * 2 + 1]
            params[paramsArr[i * 2]] = value === 'true' ? true : value === 'false' ? false : value
      }
      return params
}

function getUrlParam(name: any) {
      try {
            const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
            const r = window.location.href.split('?')[1].match(reg)
            if (r != null) {
                  return r[2]
            }
            return '' // 如果此处只写return;则返回的是undefined
      } catch (e) {
            return '' // 如果此处只写return;则返回的是undefined
      }
}

export { METHOD, AUTH_TYPE, AuthType, xsrfHeaderName, request, setAuthorization, removeAuthorization, checkAuthorization, loadInterceptors, parseUrlParams, getUrlParam }
