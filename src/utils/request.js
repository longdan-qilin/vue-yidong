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
const requestToken = axios.create()

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 请求发起会经过这里
  // config：本次请求的请求配置对象

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

request.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  const status = error.response.status
  if (status === 400) {
    this.$toast.fail('客户端请求参数错误')
  } else if (status === 401) {
    const { user } = store.state
    if (!user || !user.refresh_token) {
      /*
        直接去登录吧 没办法了 跳转到登录页面
        this.$router.push => 组件里面可以这样
        router.push('/login)
        登录路由其实没有必要 不期望保留历史记录
      */
      // return this.$router.push('/login')
      return redirectLogin()
    }
    /*
      用 refresh-token 获取新的 token
      直接用现有的 request 去请求 假如请求的结果还是401 会形成死循环
      request({})
    */
    try {
      const { data } = await requestToken({
        method: 'PUT',
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      console.log(data)
      user.token = data.data.token
      // 用新的 token 更新 store 里面的无效的 token
      store.commit('setUser', user)
      // 把之前的错误请求重新完整的再发一次
      // 这里发送请求，带过去的 token 确实是无效的 token，但是没关系，因为这个请求会经过自己的请求拦截器
      // 自己请求拦截器里面会有重新获取 token 的操作
      return request(error.config)
    } catch (err) {
      // 用 refresh_token 换取 token 的时候也出错了
      // return this.$router.replace('/login')
      return redirectLogin()
    }
    // this.$toast.fail('无效的token')
  } else if (status === 403) {
    this.$toast.fail('客户端没有权限')
  } else if (status === 404) {
    this.$toast.fail('请求资源不存在')
  } else if (status === 405) {
    this.$toast.fail('请求方法不支持')
  } else if (status === 500) {
    this.$toast.fail('服务器出错啦')
  }
  return Promise.reject(error)
})

function redirectLogin () {
  this.$router.replace({
    name: 'login',
    query: {
      // router.currentRoute => this.$route 匹配当前路由 fullpath匹配路由
      redirect: this.$router.currentRoute.fullPath
    }
  })
}
export default request
