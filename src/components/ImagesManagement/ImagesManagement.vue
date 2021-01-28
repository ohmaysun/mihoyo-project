<template>
  <div class='images-management'>
    <div class='title'>
      <h1>{{title}}</h1>
    </div>
    <div class='container'>
      <!-- 用两条假数据先调样式 -->
        <el-row v-for='item in showImgsList' :key='item.img_id' :gutter='20' class='row'>
          <div class='img-box'>
            <img :src='item.img_url' @click='showBigImg(item)'>
          </div>
          <div class='btn-box'>
            <el-button class='btn pass-btn' @click='pass(item)'>通过</el-button>
            <el-button class='btn reject-btn' @click='reject(item)'>拒绝</el-button>
            <el-button class='btn delete-btn' @click='del(item)'>删除</el-button>
            <el-button class='btn reject-btn' @click='top(item)'>置顶</el-button>
          </div>
        </el-row>
    </div>
    <ImageMaskSimple v-show="maskShow" @closeMask="closeMask" :currentImgId='currentImgId'/>
  </div>
</template>

<script>
import ImageMaskSimple from '@/components/ImageMask/ImageMaskSimple'
import { mapMutations } from 'vuex'
export default {
  name: 'ImagesManagement',
  components: {
    ImageMaskSimple
  },
  data () {
    return {
      title: '图片管理',
      showImgsList: [], // 展示的图片列表
      maskShow: false, // 是否展示弹窗
      currentImgId: '' // 当前点击的商品id
    }
  },
  computed: {
    // 测试从vuex里得到数据
    imagesStored () {
      return this.$store.state.images
    }
  },
  methods: {
    ...mapMutations(['SAVE_SHOWIMAGELIST']),
    // 展示大图
    showBigImg (item) {
      console.log(`展示大图 ${item.img_id}`)
      this.maskShow = true
      this.currentImgId = String(item.img_id)
    },
    // 传递给ImageMaskSimple弹窗组件，用于关闭弹窗
    closeMask () {
      this.maskShow = false
      this.currentImgId = ''
    },
    // 通过 status:0不可展示。status:1可展示。 要把status改为1
    pass (item) {
      console.log(`pass ${item.img_id}`)
      let that = this
      let url = 'http://81.68.89.17:8000/passImageById'
      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      this.$http.post(url, {img_id: item.img_id}, config).then(res => {
        console.log(res)
        if (res && res.data && res.data.data && res.data.code === 200) {
          // 若操作成功，重新请求数据
          that.getDatas()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 拒绝 status:0不可展示。status:1可展示。 要把status改为0
    reject (item) {
      console.log(`reject ${item.img_id}`)
      let that = this
      let url = 'http://81.68.89.17:8000/rejectImageById'
      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      this.$http.post(url, {img_id: item.img_id}, config).then(res => {
        console.log(res)
        if (res && res.data && res.data.data && res.data.code === 200) {
          // 若操作成功，重新请求数据
          that.getDatas()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 删除
    del (item) {
      console.log(`delete ${item.img_id}`)
      let that = this
      let url = 'http://81.68.89.17:8000/delImageById'
      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      this.$http.post(url, {img_id: item.img_id}, config).then(res => {
        console.log(res)
        if (res && res.data && res.data.data && res.data.code === 200) {
          // 若删除成功，重新请求数据
          that.getDatas()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 置顶 undone
    top (item) {
      console.log(`top ${item.img_id}`)
    },
    created () {
    },
    // 获取所有图片
    getDatas () {
      // console.log('ShowImage getDatas()')
      let that = this // 用that保存vue实例
      // 这里是服务器接口地址
      // let url = 'http://127.0.0.1:8000/getImages' // 本地开启node app.js
      // let url = '/getImages' // 本地使用mock.js 要开启mock配置
      let url = 'http://81.68.89.17:8000/getImages'
      this.$http.get(url)
        .then(res => {
          // console.log(res)
          // 对res的返回添加判断
          if (res && res.data && res.data.data && res.data.code === 200) {
            if (res.data.data.files) {
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
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    // 假数据调试。
    // this.showImgsList = this.imagesStored
    this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
    @import "../../css/imagesManagement.scss";
</style>
