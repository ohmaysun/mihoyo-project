<template>
  <div class='images-management'>
    <div class='title'>
      <h1>{{title}}</h1>
    </div>
    <div class='container'>
      <!-- 用两条假数据先调样式 -->
        <el-row v-for='item in imagesStored' :key='item.id' :gutter='20' class='row'>
          <div class='img-box'>
            <img :src='item.url' @click='showBigImg(item)'>
          </div>
          <div class='btn-box'>
            <el-button class='btn pass-btn' @click='pass(item.id)'>通过</el-button>
            <el-button class='btn reject-btn' @click='reject(item.id)'>拒绝</el-button>
            <el-button class='btn delete-btn' @click='del(item.id)'>删除</el-button>
            <el-button class='btn reject-btn' @click='top(item.id)'>置顶</el-button>
          </div>
        </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImagesManagement',
  data () {
    return {
      title: '图片管理'
    }
  },
  computed: {
    // 测试从vuex里得到数据
    imagesStored () {
      return this.$store.state.images
    }
  },
  methods: {
    // 展示大图
    showBigImg (item) {
      console.log(`展示大图 ${item.id}`)
    },
    // 通过
    pass (id) {
      console.log(`pass ${id}`)
    },
    // 拒绝
    reject (id) {
      console.log(`reject ${id}`)
    },
    // 删除
    del (id) {
      console.log(`delete ${id}`)
    },
    // 置顶
    top (id) {
      console.log(`top ${id}`)
    },
    created () {
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "../../css/imagesManagement.scss";
</style>
