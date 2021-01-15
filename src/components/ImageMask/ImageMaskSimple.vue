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
      showImgUrl: '', // 显示的图片的url
      currentImgIndex: -1 // 当前显示的图片的index
    }
  },
  // 希望从父组件获得的是当前点击图片的id，以及当前已缓存的图片列表。
  // 通过id再自行判断该图片位于数组中的位置，以及考虑index越界问题。
  props: {
    currentImgId: {
      type: String
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
        // 得到要显示的图片的url
        that.showImgUrl = that.showImgsList[that.currentImgIndex].img_url
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
    }
  }
}
</script>

<style lang='scss' scoped>
    @import '../../css/imageMaskSimple.scss';
</style>
