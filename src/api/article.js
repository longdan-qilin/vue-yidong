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

// 获取文章详情
export const getArticleById = articleId => {
  return request({
    method: 'get',
    url: `/v1_0/articles/${articleId}`
  })
}
