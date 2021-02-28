<template>
  <div class='images-management'>
    <div class='title'>
      <h1>{{title}}</h1>
    </div>
    <div class='container'>
      <el-button class='btn sort-btn' @click='saveOrder'>保存拖曳后的页内排序</el-button>
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
    <ImageMaskSimple v-show="maskShow" @closeMask="closeMask" :currentImgId='currentImgId' :isShowManage='true'/>
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
      pagesize: 20, // 每页的数据
      imagesShow: [], // 当前页要展示的图片列表
      isLoading: true // 加载数据的loading页面
    }
  },
  computed: {
    // 测试从vuex里得到数据
    // imagesStored () {
    //   return this.$store.state.images
    // }
    // 当前页展示的图片列表
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
      this.getDatas()
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
          this.$message.success(`[通过]操作成功！`)
          that.getDatas()
        }
      }).catch(err => {
        this.$message.error(`err:${err}`)
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
          this.$message.success(`[拒绝]操作成功！`)
          that.getDatas()
        }
      }).catch(err => {
        this.$message.error(`err:${err}`)
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
          this.$message.success(`[删除]操作成功！`)
          that.getDatas()
        }
      }).catch(err => {
        this.$message.error(`err:${err}`)
        console.log(err)
      })
    },
    // 置顶。原来的策略是sort直接置0。改进，设为全局最小值-1000，排序时按照sort asc的规则。
    top (item) {
      // console.log(`top ${item.img_id}`)
      let that = this
      let url = 'http://81.68.89.17:8000/topImageById'
      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      let topSort = this.showImgsList[0].sort - 1000
      this.$http.post(url, {img_id: item.img_id, sort: topSort}, config).then(res => {
        if (res && res.data && res.data.data && res.data.code === 200) {
          // 若操作成功，重新请求数据
          this.$message.success(`[置顶]操作成功！`)
          that.getDatas()
        }
      }).catch(err => {
        this.$message.error(`err:${err}`)
        console.log(err)
      })
    },
    // 获取所有图片 现在是一次请求返回所有数据， 后续可改为分页请求数据
    getDatas () {
      // console.log('ShowImage getDatas()')
      let that = this // 用that保存vue实例
      this.isLoading = true // 加载状态设置为true
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
              // console.log(list)
              // 设置获取到的全部数据
              that.showImgsList = list
              // 设置当前页要显示的数据
              // 第一次获取到imagesShow，无法通过监听pagesize和pagenum得到
              that.imagesShow = that.showImgsList.slice((that.currentPage - 1) * that.pagesize, that.currentPage * that.pagesize)
              // console.log(that.showImgsList)
              that.SAVE_SHOWIMAGELIST(that.showImgsList)
              // console.log(that.showImgsList)
            }
          }
        })
        .then(res => {
          that.isLoading = false // 加载状态设置为false
        })
        .catch(err => {
          this.$message.error(`err:${err}`)
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
    },
    // 保存排序。最终保存规则，按按当前页面的拖曳完的数组顺序，从小到大重新赋他们原有的sort
    saveOrder () {
      // console.log('dragbefore')
      let saveList = this.imagesShow // 该页拖曳后的数组
      let sortList = [] // saveList数组的权重数组
      this.imagesShow.forEach(item => {
        // console.log(`${item.img_id}:${item.sort}`)
        sortList.push(item.sort)
      })
      sortList.sort()
      let simpleList = [] // 简化，只有img_id和sort字段。用于传给服务器
      for (let i = 0; i < saveList.length; i++) {
        saveList[i].sort = sortList[i]
        simpleList.push({
          img_id: saveList[i].img_id,
          sort: sortList[i]
        })
      }
      // 把这几条记录更新到数据库 todo
      // 更新该页数组的sort字段
      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      let that = this
      let url = 'http://81.68.89.17:8000/saveOrder'
      this.$http.post(url, {data: JSON.stringify(simpleList)}, config).then(res => {
        // console.log(res)
        if (res && res.data && res.data.data && res.data.code === 200) {
          // 若操作成功，重新请求数据
          this.$message.success(`[保存]操作成功！`)
          that.getDatas()
        }
      }).catch(err => {
        this.$message.error(`err:${err}`)
        console.log(err)
      })
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
