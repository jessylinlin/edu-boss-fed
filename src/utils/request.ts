import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import qs from 'qs'

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

let isRfreshing = false // 控制刷新token状态
let requests:any[] = []// 存储刷新token期间的401请求（多次）

const request = axios.create({
  // 配置选项
//   baseURL
//   timeout
})

// 请求拦截器
request.interceptors.request.use((config: any) => {
  // console.log(config)
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function (response) {
  // http状态吗为2xx 进入此逻辑
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  // 如果是自定义状态码，错误处理

  return response
}, async function (error) {
  // 响应码 超出2xx 进入这里
  // 如果是http自带的错误状态码
  // console.dir(error)
  if (error.response) {
    // 请求收到响应，状态码不是2xx
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token失效情况视情况
      if (!store.state.user) {
        redirectLogin()

        return Promise.reject(error)
      }

      //  尝试刷新token
      if (!isRfreshing) {
        isRfreshing = true
        // 获取新的token
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新token失败')
          }
          // 刷新token成功
          // 1、把刷新拿到的新的access_token更新到容器和本地存储中
          store.commit('setUser', res.data.content)

          // 执行requests中存储的请求发出
          requests.forEach(req => req())

          // 重置requests
          requests = []

          // 把本次失败的请求重新发出去 error.config
          return request(error.config)
        }).catch(err => {
        // 把当前登录用户清楚
          store.commit('setUser', null)

          redirectLogin()
          return Promise.reject(err)
        }).finally(() => {
          isRfreshing = false
        })
      }
      // 刷新状态下 请求挂起[]
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
    } else if (status === 403) {
      Message.error('没有权限访问,请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误， 请联系管理员')
    }
    // 400
    // 401
    // 403
    // 404
    // 500
  } else if (error.request) {
    // 请求发出未收到响应（请求超时 网络断开）
    Message.error('请求超时，请刷新重试')
  } else {
    // 请求设置的信息触发的未知错误
    Message.error(`请求失败: ${error.message}`)
  }
  // 抛出 请求失败的错误对象， 丢给上一个调用者
  return Promise.reject(error)
})

export default request
