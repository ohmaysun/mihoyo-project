<template>
  <div class='show-image'>
    <div class='header'>
      <h1>{{title}}</h1>
      <div class='button-box'>
        <router-link to='/uploadImage'>去上传图片</router-link>
      </div>
    </div>
    <div class='container' id='showContainer'>
      <div v-for='item in showImgsList' :key='item.img_id' class='img-box'>
        <img :src='item.img_url' @click='showBigImg(item)'>
      </div>
    </div>
    <ImageMaskSimple v-show="maskShow" @closeMask="closeMask" :currentImgId='currentImgId'/>
    <transition name='fade'>
      <Loading v-if='isLoading'></Loading>
    </transition>
  </div>
</template>

<script>
import ImageMaskSimple from '@/components/ImageMask/ImageMaskSimple'
import Loading from '@/components/Loading/Loading'
import { ExpriesCache, generateKey } from '@/utils/DataCache'
import { mapMutations } from 'vuex'
export default {
  name: 'ShowImage',
  components: {
    ImageMaskSimple,
    Loading
  },
  data () {
    return {
      title: '图片展示',
      showImgsList: [], // 展示的图片列表。把每次请求到的数据都add到这个要展示的数据里去。
      maskShow: false, // 是否展示弹窗
      currentImgId: '', // 当前点击的商品id
      isLoading: true, // 是否加载
      pagesize: 20, // 一次请求20条数据
      currentpage: 1, // 默认请求第一页
      loadMoreBool: true, // 是否拉到底部
      // 发现会一直不停地请求当前最后一页的数据，加了isNoMoreBool这个参数来控制，已经将所有数据请求完成了
      isNoMoreBool: false // 是否已经把所有数据请求完了
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
    // 获取要展示的图片。每次请求的数据append到showImgsList
    getDatas () {
      // console.log('ShowImage getDatas()')
      let that = this // 用that保存vue实例
      // 这里是服务器接口地址
      // let url = 'http://127.0.0.1:8000/getImages' // 本地开启node app.js
      // let url = '/getImages' // 若使用mock的数据。本地使用mock.js 要开启mock配置
      // console.log(`getdatas pagenum=${this.currentpage}`)
      let url = `http://81.68.89.17:8000/getShowImages?pagesize=${this.pagesize}&pagenum=${this.currentpage}`
      this.$http.get(url)
        .then(res => {
          // console.log(res)
          let list = res.data.data.files
          let baseUrl = res.data.data.baseurl || ''
          list.forEach((item) => {
            item.img_url = baseUrl + item.img_url
          })
          console.log(list)
          if (list.length) {
            // 请求到数据，下一次请求的currentpage++
            that.currentpage++
          } else {
            that.isNoMoreBool = true
          }
          // 将当前请求到的数据，与已有的数据拼接起来
          that.showImgsList = this._.concat(that.showImgsList, list)
          // console.log(that.showImgsList)
          that.SAVE_SHOWIMAGELIST(that.showImgsList)
          // console.log(that.showImgsList)
        })
        .then(res => {
          // 请求完数据，loading结束
          that.isLoading = false
          // 请求完数据，下一次可以触发loadmore
          that.loadMoreBool = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 入参：pagesize，currentpage。输出所对应的list
    // getData方法升级，考虑数据五分钟缓存，读数据
    getDatasUsingCache () {
      // 生成key, 当前按页请求的数据的右索引
      const key = generateKey('getImages', this.showImgsList.length)
      // 获得数据
      let data = ExpriesCache.get(key, this.pagesize, this.currentpage, this.showImgsList.length)
      // 如果从缓存中获取不到
      if (!data) {
        console.log('从请求接口拿的数据')
        let that = this // 用that保存vue实例
        let url = `http://81.68.89.17:8000/getShowImages?pagesize=${this.pagesize}&pagenum=${this.currentpage}`
        this.$http.get(url).then(res => {
          // console.log(res)
          let list = res.data.data.files
          let baseUrl = res.data.data.baseurl || ''
          list.forEach((item) => {
            item.img_url = baseUrl + item.img_url
          })
          // console.log(list)
          if (list.length) {
            // 请求到数据，下一次请求的currentpage++
            that.currentpage++
            // 将当前请求到的数据，与已有的数据拼接起来
            that.showImgsList = this._.concat(that.showImgsList, list)
            // 使用 300s 缓存，300s之后再次get就会 获取null 而从服务端继续请求
            ExpriesCache.set(key, that.showImgsList, 300)
            // console.log(that.showImgsList)
            that.SAVE_SHOWIMAGELIST(that.showImgsList)
            // console.log(that.showImgsList)
          } else {
            // 如果不再请求导数据，则设置没有更多为true
            that.isNoMoreBool = true
          }
        }).then(res => {
          // 请求完数据，loading结束
          that.isLoading = false
          // 请求完数据，下一次可以触发loadmore
          that.loadMoreBool = true
        }).catch(err => {
          console.log(err)
        })
      } else {
        console.log('从cache里拿的数据')
        // 将从缓存中拿到的数据，设置为要展示的数据
        this.showImgsList = data
        // 请求完数据，loading结束
        this.isLoading = false
        // console.log(that.showImgsList)
        this.SAVE_SHOWIMAGELIST(this.showImgsList)
      }
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
    },
    // 把参数重置默认
    setDefault () {
      // 重置数组
      this.showImgsList = []
      this.currentpage = 1
      this.loadMoreBool = true
      this.isNoMoreBool = false
    },
    // 上拉刷新事件 好像unwork
    // onPullUpRefresh () {
    //   console.log('onPullUpRefresh')
    //   this.setDefault()
    //   // 重新发送请求
    //   this.getDatas()
    // },
    // 判断滚动条是否到底部，请求新的数据
    loadMore () {
      // 变量scrollTop是滚动条滚动时，距离顶部的距离
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      // 变量windowHeight是可视区的高度
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight
      // 变量scrollHeight是滚动条的总高度
      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight
      // 滚动条到底部的条件
      // console.log(scrollTop + windowHeight + '--' + scrollHeight)
      // console.log(this.currentpage)
      if (
        scrollTop + windowHeight >= scrollHeight - 200 &&
        this.loadMoreBool && !this.isNoMoreBool
      ) {
        // false防止getDatas()加载数据函数多次触发
        this.loadMoreBool = false
        // this.getDatas()
        this.getDatasUsingCache()
      }
    }
  },
  created () {
    // this.getDatas()
    this.getDatasUsingCache()
  },
  mounted () {
    // this.getDatas()
    // 监视scroll滚动条
    window.addEventListener('scroll', this.loadMore, true)
  },
  destroyed () {
    // 离开页面清除（移除）滚轮滚动事件
    window.removeEventListener('scroll', this.loadMore)
  }
}
</script>

<style lang="scss" scoped>
    @import "../../css/showImage.scss";
</style>
