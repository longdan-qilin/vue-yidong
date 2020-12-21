/* 评论请求模块 */
import request from '@/utils/request'

//  获取所有评论
export const getCommonts = params => {
  return request({
    method: 'get',
    url: 'v1_0/comments',
    params
  })
}

// 对评论或评论回复点赞
export const addCommonLikes = target => {
  return request({
    method: 'POST',
    url: 'v1_0/comment/likings',
    data: {
      target
    }
  })
}

// 对评论或评论回复取消点赞
export const deleteCommonLikes = target => {
  return request({
    method: 'DELETE',
    url: `v1_0/comment/likings/${target}`
  })
}

// 添加评论或评论回复
export const addComments = data => {
  return request({
    method: 'POST',
    url: 'v1_0/comments',
    data
  })
}
