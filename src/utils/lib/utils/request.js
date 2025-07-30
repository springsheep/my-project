/*
 * @Descripttion: ----描述----
 * @version: 1.0
 * @Author: 张鹏
 * @Date: 2022-10-31 10:32:22
 * @LastEditors: shilihong
 * @LastEditTime: 2023-10-30 17:01:39
 */
import axios from 'axios'
// import notification from 'ant-design-vue/es/notification' // 创建 axios 实例
import Cookies from 'js-cookie'
import storage from 'store'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
const ACCESS_TOKEN = "Token";
var request = axios.create({
    timeout: 3 * 60 * 1000, // 请求超时时间
}) // 异常拦截处理器

var errorHandler = function errorHandler(error) {
    var message = error.message
    // notification.error({
    //     message: '错误',
    //     description: message,
    // })
    console.warn(message);
    return Promise.reject(error)
} // request interceptor

request.interceptors.request.use(function (config) {
    const token = Cookies.get('accessTokenFlag') ? storage.get(ACCESS_TOKEN) : ''
    if (token) {
        config.headers.Authorization = token
    }

    return config
}, errorHandler) // response interceptor

request.interceptors.response.use(function (response) {
    var data = response.data

    if (data.code !== 0) {
        var error = new Error(data.msg || 'Error')
        error.response = response
        errorHandler(error).then(function (r) {
            return Promise.reject(r)
        })
    }

    return Promise.resolve(response.data)
}, errorHandler)
export default request
