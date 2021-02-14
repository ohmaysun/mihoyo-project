<template>
  <div class='images-management'>
    <div class='title'>
      <h1>{{title}}</h1>
    </div>
    <div class='container'>
      <!-- <el-button class='btn sort-btn' @click='saveOrder'>保存排序</el-button> -->
      <draggable v-model='imagesShow' chosen-class='chosen' @end='datadragEnd' :options='{animation:200}'>
        <transition-group>
        <div v-for='item in imagesShow' :key='item.img_id' class='row'>
          <div class='img-box'>
            <img :src='item.img_url' @click='showBigImg(item)'>
          </div>
          <div class='btn-box'>
            <el-button class='btn pass-btn' @click='pass(item)' v-show='item.status===0'>通过</el-button>
            <el-button class='btn reject-btn' @click='reject(item)' v-show='item.status===1'>拒绝</el-button>
            <el-button class='btn delete-btn' @click='del(item)'>删除</el-button>
            <el-button class='btn reject-btn' @click='top(item)'>置顶</el-button>
          </div>
        </div>
        </transition-group>
      </draggable>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="showImgsList.length">
      </el-pagination>
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
import { mapMutations } from 'vuex'
import draggable from 'vuedraggable'
export default {
  name: 'ImagesManagement',
  components: {
    ImageMaskSimple,
    draggable,
    Loading
  },
  data () {
    return {
      title: '图片管理',
      showImgsList: [], // 展示的图片列表
      maskShow: false, // 是否展示弹窗
      currentImgId: '', // 当前点击的商品id
      currentPage: 1, // 初始页
      pagesize: 10, // 每页的数据
      imagesShow: [], // 当前页要展示的图片列表
      isLoading: true
    }
  },
  computed: {
    // 测试从vuex里得到数据
    imagesStored () {
      return this.$store.state.images
    }
    // 当前页要展示的图片列表
    // imagesShow () {
    //   return this.showImgsList.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize)
    // }
  },
  watch: {
    currentPage (oldVal, newVal) {
      if (oldVal !== newVal) {
        this.imagesShow = this.showImgsList.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize)
      }
    },
    pagesize (oldVal, newVal) {
      if (oldVal !== newVal) {
        this.imagesShow = this.showImgsList.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize)
      }
    }
  },
  methods: {
    ...mapMutations(['SAVE_SHOWIMAGELIST']),
    // 展示大图
    showBigImg (item) {
      // console.log(`展示大图 ${item.img_id}`)
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
      // console.log(`pass ${item.img_id}`)
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
      // console.log(`reject ${item.img_id}`)
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
      // console.log(`delete ${item.img_id}`)
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
    // 获取所有图片 现在是一次请求返回所有数据， 后续可改为分页请求数据
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
              // 设置获取到的全部数据
              that.showImgsList = list
              // 设置当前页要显示的数据
              that.imagesShow = that.showImgsList.slice((that.currentPage - 1) * that.pagesize, that.currentPage * that.pagesize)
              // console.log(that.showImgsList)
              that.SAVE_SHOWIMAGELIST(that.showImgsList)
              // console.log(that.showImgsList)
            }
          }
        })
        .then(res => {
          that.isLoading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 处理分页的选择pagesize
    handleSizeChange (size) {
      this.pagesize = size
    },
    // 处理分页的当前page
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
    },
    // 获取数据并设置当前页要显示的数据
    handleDataList () {
      this.getDatas()
    },
    // 拖曳
    async datadragEnd (evt) {
      // console.log(evt)
      evt.preventDefault()
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      // 遍历数组,将索引值赋值到对应的sort_order上面,完成排序
      // 其实只要把改变索引的两项的sort调整。 就可以。按照sort查询
    },
    // 保存排序 undone
    saveOrder () {
      console.log('save order')
    }
  },
  created () {
    this.handleDataList()
  }
}
</script>

<style lang="scss" scoped>
    @import "../../css/imagesManagement.scss";
</style>
