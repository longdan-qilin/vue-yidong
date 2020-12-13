/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import store from '@/store'
const request = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn/' // 基础路径
  baseURL: 'http://toutiao-app.itheima.net/' // 接口的基准路径
})

export default request

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 请求发起会经过这里
  // config：本次请求的请求配置对象
  console.log(config)
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 注意：这里务必要返回 config 配置对象 否则请求就停在这里出不去
  return config
}, function (error) {
  // Do something with request error
  // 如果请求出错了 （还没有发出去）会进入这里
  return Promise.reject(error)
})

// 响应拦截器
// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})
