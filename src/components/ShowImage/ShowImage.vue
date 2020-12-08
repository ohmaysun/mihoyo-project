<template>
  <div class='show-image'>
    <div class='title'>
        <h1>{{title}}</h1>
        <!-- <h3>{{count}}</h3> -->
        <h2>测试axios和mockjs</h2>
        <ul>
          <li v-for='item in showImgsList' :key='item.id'>
            <div class='img-box'>
              <img :src='item.url' @click='showBigImg(item)'>
            </div>
          </li>
        </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowImage',
  data () {
    return {
      title: '图片展示',
      showImgsList: [] // 展示的图片列表
    }
  },
  computed: {
    // 测试从vuex里得到数据
    // count () {
    //   return this.$store.state.count
    // }
  },
  methods: {
    // 获取要展示的图片。现在是通过mockjs来获取假数据
    getDatas () {
      console.log('ShowImage getDatas()')
      let that = this // 用that保存vue实例
      this.$http.get('/getImages')
        .then(res => {
          // console.log(res)
          that.showImgsList = res.data.data
          console.log(that.showImgsList)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 展示大图
    showBigImg (item) {
      console.log(`展示大图 ${item.id}`)
    }
  },
  created: function () {
  },
  mounted: function () {
    this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
    @import "../../css/showImage.scss";
</style>
