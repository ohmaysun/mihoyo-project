<template>
  <div class='show-image'>
    <div class='header'>
      <h1>{{title}}</h1>
      <div class='button-box'>
        <router-link to='/uploadImage'>去上传图片</router-link>
      </div>
    </div>
    <div class='container'>
      <div v-for='item in showImgsList' :key='item.img_id' class='img-box'>
        <img :src='item.img_url' @click='showBigImg(item)'>
      </div>
    </div>
    <ImageMaskSimple v-show="maskShow" @closeMask="closeMask" :currentImgId='currentImgId'/>
  </div>
</template>

<script>
import ImageMaskSimple from '@/components/ImageMask/ImageMaskSimple'
import { mapMutations } from 'vuex'
export default {
  name: 'ShowImage',
  components: {
    ImageMaskSimple
  },
  data () {
    return {
      title: '图片展示',
      showImgsList: [], // 展示的图片列表
      maskShow: false, // 是否展示弹窗
      currentImgId: '' // 当前点击的商品id
    }
  },
  computed: {
    // 测试从vuex里得到数据
    // count () {
    //   return this.$store.state.count
    // }
  },
  methods: {
    ...mapMutations(['SAVE_SHOWIMAGELIST']),
    // 获取要展示的图片
    getDatas () {
      // console.log('ShowImage getDatas()')
      let that = this // 用that保存vue实例
      // 这里是服务器接口地址
      // let url = 'http://127.0.0.1:8000/getImages' // 本地开启node app.js
      // let url = '/getImages' // 若使用mock的数据。本地使用mock.js 要开启mock配置
      let url = 'http://81.68.89.17:8000/getShowImages'
      this.$http.get(url)
        .then(res => {
          console.log(res)
          let list = res.data.data.files
          let baseUrl = res.data.data.baseurl || ''
          list.forEach((item) => {
            item.img_url = baseUrl + item.img_url
          })
          console.log(list)
          that.showImgsList = list
          // console.log(that.showImgsList)
          that.SAVE_SHOWIMAGELIST(that.showImgsList)
          // console.log(that.showImgsList)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 展示大图
    showBigImg (item) {
      // console.log(`展示大图 ${item.id}`)
      // console.log(item)
      this.maskShow = true
      this.currentImgId = String(item.img_id)
    },
    // 传递给ImageMaskSimple弹窗组件，用于关闭弹窗
    closeMask () {
      this.maskShow = false
      this.currentImgId = ''
    }
    // 上拉刷新事件
    // onPullUpRefresh () {
    //   console.log('onPullUpRefresh')
    //   // 重置数组
    //   this.showImgsList = []
    //   // 重新发送请求
    //   this.getDatas()
    // }
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
