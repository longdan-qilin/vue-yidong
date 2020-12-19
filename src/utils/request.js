/**
 * 封装 axios 请求模块
 */
import axios from 'axios'
import store from '@/store'
import JSONBIG from 'json-bigint'
// var json = '{ "value" : 9223372036854775807, "v2": 123 }'

// console.log(JSONBIG.parse(json))
// JSONBig.parse()  把 JSON格式的字符串转为 JavaScript对象
// JsonBig.stringify() // 把 JavaScript 对象转为 JSON 格式的字符串

// 自定义后端返回的原始数据
// data：后端返回的原始数据，说白了就是 JSON 格式的字符串
const request = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn/' // 基础路径
  baseURL: 'http://toutiao-app.itheima.net/', // 接口的基准路径
  transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      return JSONBIG.parse(data)
    } catch (err) {
      // 如果转换失败，则包装为统一数据格式并返回
      return {
        data
      }
    }
    // axios 默认会在内部这样来处理后端返回的数据
    // return JSON.parse(data)
  }]
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
// axios.interceptors.response.use(function (response) {
//   // Any status code that lie within the range of 2xx cause this function to trigger
//   // Do something with response data
//   return response
// }, function (error) {
//   // Any status codes that falls outside the range of 2xx cause this function to trigger
//   // Do something with response error
//   return Promise.reject(error)
// })
