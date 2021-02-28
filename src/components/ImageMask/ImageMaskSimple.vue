<template>
  <div class='mask-bg' @click='closeMask'>
    <!-- {{currentImgId}} -->
    <div class='item-box'>
      <img :src='showImgUrl'>
    </div>
    <div class='button-box'>
      <!--@click.stop 阻止事件冒泡-->
      <div class='left' @click.stop='toLeft' v-show='currentImgIndex>0'></div>
      <div class='right' @click.stop='toRight' v-show='currentImgIndex<listLen-1'></div>
      <!-- 图片的审核通过/拒绝按钮 只在管理页面展示大图时展示该按钮box-->
      <div class='manage-box' v-if='isShowManage'>
        <el-button class='btn pass-btn' @click='pass()' :disabled='disablePassBtn'>通过</el-button>
        <el-button class='btn reject-btn' @click='reject()' :disabled='disableRejectBtn'>拒绝</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ImageMaskSimple',
  data () {
    return {
      title: '展示大图的弹窗-简易版',
      currentImg: {}, // 当前要展示大图的图片
      showImgUrl: '', // 显示的图片的url
      currentImgIndex: -1, // 当前显示的图片的index
      disablePassBtn: false, // 是否禁用pass按钮
      disableRejectBtn: false // 是否禁用reject按钮
    }
  },
  // 希望从父组件获得的是当前点击图片的id，以及当前已缓存的图片列表。
  // 通过id再自行判断该图片位于数组中的位置，以及考虑index越界问题。
  props: {
    currentImgId: {
      type: String
    },
    // 是否展示审核按钮
    isShowManage: {
      type: Boolean
    }
  },
  watch: {
    currentImgId (value) {
      console.log('监听到图片变化', value)
      let that = this
      // 如果监听到图片id变化，且新变化的值不为空，则设置currentImgIndex
      if (value) {
        // 根据点击图片的id和已请求到的图片列表得到该图片的index
        that.currentImgIndex = that.showImgsList.findIndex(item => item.img_id.toString() === that.currentImgId)
        // 当前要展示的大图item that.showImgsList[that.currentImgIndex]
        that.currentImg = that.showImgsList[that.currentImgIndex]
        // 得到要显示的图片的url
        that.showImgUrl = that.showImgsList[that.currentImgIndex].img_url
        // 设置disablePassBtn、disableRejectBtn
        that.disablePassBtn = that.currentImg.status === 1
        that.disableRejectBtn = that.currentImg.status === 0
      }
    }
  },
  computed: {
    ...mapGetters(['showImgsList']),
    listLen () {
      return this.showImgsList.length
    }
  },
  methods: {
    closeMask () {
      console.log('closeMask')
      this.showImgUrl = ''
      this.currentImgIndex = -1
      this.disablePassBtn = false
      this.disableRejectBtn = false
      this.$emit('closeMask')
    },
    // 点击向左，切换到上一张图片
    toLeft () {
      // console.log('toleft')
      this.currentImgIndex--
      // 得到要显示的图片的url
      this.showImgUrl = this.showImgsList[this.currentImgIndex].img_url
    },
    // 点击向右按钮，切换到下一张图片
    toRight () {
      // console.log('toright')
      this.currentImgIndex++
      // 得到要显示的图片的url
      this.showImgUrl = this.showImgsList[this.currentImgIndex].img_url
    },
    // 通过 status:0不可展示。status:1可展示。 要把status改为1
    pass () {
      // console.log(`pass ${item.img_id}`)
      let that = this
      let url = 'http://81.68.89.17:8000/passImageById'
      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      this.$http.post(url, {img_id: that.currentImg.img_id}, config).then(res => {
        console.log(res)
        if (res && res.data && res.data.data && res.data.code === 200) {
          // 若操作成功
          this.$message.success(`[通过]操作成功！`)
          that.disablePassBtn = false
          that.disableRejectBtn = true
          that.closeMask()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 拒绝 status:0不可展示。status:1可展示。 要把status改为0
    reject () {
      // console.log(`reject ${item.img_id}`)
      let that = this
      let url = 'http://81.68.89.17:8000/rejectImageById'
      let config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      this.$http.post(url, {img_id: that.currentImg.img_id}, config).then(res => {
        console.log(res)
        if (res && res.data && res.data.data && res.data.code === 200) {
          // 若操作成功
          this.$message.success(`[拒绝]操作成功！`)
          that.disablePassBtn = true
          that.disableRejectBtn = false
          that.closeMask()
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
    @import '../../css/imageMaskSimple.scss';
</style>
