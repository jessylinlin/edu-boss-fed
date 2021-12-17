/* 用户相关请求模块 */
// import store from '@/store'
import request from '@/utils/request'
import qs from 'qs'

interface User {
    phone: string
    password: string
}

export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data) // axios 请求， 默认发送application/json
  })
}
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
    // headers: {
    //   Authorization: store.state.user.access_token
    // }
  })
}

// 获取用户列表
export const getUserPages = (data:any) => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}
