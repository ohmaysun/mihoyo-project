<template>
  <div class="mask-bg" @click="closeMask">
    {{currentImgId}}
    <div class="item-box">
      <img :src='showImgUrl'>
    </div>
    <div class="button-box">
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
      // console.log('监听到图片变化', value)
      let that = this
      // 如果监听到图片id变化，且新变化的值不为空，则设置currentImgIndex
      if (value) {
        // 根据点击图片的id和已请求到的图片列表得到该图片的index
        that.currentImgIndex = that.showImgsList.findIndex(item => item.id === that.currentImgId)
        // 得到要显示的图片的url
        that.showImgUrl = that.showImgsList[that.currentImgIndex].url
      }
    }
  },
  computed: {
    ...mapGetters(['showImgsList'])
  },
  methods: {
    closeMask () {
      this.showImgUrl = ''
      this.currentImgIndex = -1
      this.$emit('closeMask')
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "../../css/imageMaskSimple.scss";
</style>
