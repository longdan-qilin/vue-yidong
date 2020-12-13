/* 文章请求的相关模块 */
import request from '@/utils/request'

/* 获取频道的文章列表 */
export const getArticles = params => {
  return request({
    method: 'get',
    url: '/v1_1/articles',
    params
  })
}
