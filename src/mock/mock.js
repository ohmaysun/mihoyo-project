// 获取mockjs插件
const Mock = require('mockjs')
// 获取mock.Random对象
const Random = Mock.Random
// mock一组数据demo
const produceImagesData = (opt) => {
  // console.log('opt', opt)
  let list = []
  for (let i = 0; i < 50; i++) {
    // id；weight：权重；url：图片url；upload_date：上传时间；last_op_date：上一次操作时间；status：图片状态，用于管理端的
    let tmpTime = Random.date() + ' ' + Random.time() // 随机生成一个假时间戳
    let newItem = {
      id: i,
      weight: 0,
      url: 'https://upload-bbs.mihoyo.com/upload/2020/11/29/15551716/83ec897a6ae2903e4e3e1c56cb20351f_7744505167275777082.jpg?x-oss-process=image/resize,s_600/quality,q_80/auto-orient,0/interlace,1/format,jpg',
      upload_date: tmpTime,
      last_op_date: tmpTime,
      status: 0
    }
    list.push(newItem)
  }
  return {
    data: list
  }
}
// 当get请求到/getImages路由时Mock会拦截请求并返回
Mock.mock('/getImages', 'get', produceImagesData)
