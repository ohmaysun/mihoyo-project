const mutations = {
  // for test
  // add (state) {
  //   state.count += 1
  // },
  // reduce (state) {
  //   state.count -= 1
  // }
  // 图片展示页面 把图片保存到store,
  SAVE_SHOWIMAGELIST (state, list) {
    state.showImgsList = list
  }
}

export default mutations
