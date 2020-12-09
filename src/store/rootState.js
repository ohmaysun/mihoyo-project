const state = {
  // for test
  count: 0,
  // str: 'test',
  // 测试用的展示图片们
  images: [
    // url:图片地址
    // weight:权重
    {
      id: 1,
      url: 'https://upload-bbs.mihoyo.com/upload/2020/11/29/15551716/83ec897a6ae2903e4e3e1c56cb20351f_7744505167275777082.jpg?x-oss-process=image/resize,s_600/quality,q_80/auto-orient,0/interlace,1/format,jpg',
      weight: 0
    },
    {
      id: 2,
      url: 'https://upload-bbs.mihoyo.com/upload/2020/11/28/83741927/dc77d9cd7932ff1d6cc5bb042cb942af_7914024931949708101.jpg?x-oss-process=image/resize,s_600/quality,q_80/auto-orient,0/interlace,1/format,jpg',
      weight: 0
    }
  ],
  // 图片展示页面用到的，当前已经加载出的图片，保存到store
  showImgsList: []
}

export default state
