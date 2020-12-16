/* 频道请求的相关的模块 */
import request from '@/utils/request'

// 获取全部频道请求
export const getAllChannels = () => {
  return request({
    method: 'get',
    url: '/v1_0/channels'
  })
}

// 添加用户频道
export const addUserChannel = (channel) => {
  return request({
    method: 'PATCH',
    url: 'v1_0/user/channels',
    data: {
      channels: [channel]
    }
  })
}

// 删除用户频道
export const deleteUserChannels = (channelId) => {
  return request({
    method: 'DELETE',
    url: `v1_0/user/channels/${channelId}`
  })
}
