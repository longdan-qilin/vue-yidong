/* 用户搜索请求模块 */
import request from '@/utils/request'

// 联想建议
export const geSearchSuugestions = q => {
  return request({
    method: 'get',
    url: 'v1_0/suggestion',
    params: {
      q
    }
  })
}

/* 搜索结果 */
export const geSearchResult = params => {
  return request({
    method: 'get',
    url: 'v1_0/search',
    params
  })
}
