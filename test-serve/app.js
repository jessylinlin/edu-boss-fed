const express = require('express')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')
// 创建实例
const app = express()

// app.get('/', (req, res) => {

// })

// dist托管到web服务中 默认访问/ 时候， 返回托管目录中的index.html
app.use(express.static(path.join(__dirname, '../dist')))

app.use('/boss', createProxyMiddleware({
  target: 'http://eduboss.lagou.com/',
  changeOrigin: true
}))

app.use('/front', createProxyMiddleware({
  target: 'http://edufront.lagou.com/',
  changeOrigin: true
}))

app.listen(3000, () => {
  console.log('running...')
})
