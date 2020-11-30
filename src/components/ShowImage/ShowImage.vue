<template>
  <div class='show-image'>
    <div class='title'>
        <h1>{{title}}</h1>
        <!-- <h3>{{count}}</h3> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowImage',
  data () {
    return {
      title: '图片展示'
    }
  },
  computed: {
    // 测试从vuex里得到数据
    // count () {
    //   return this.$store.state.count
    // }
  }
}
</script>

<style lang="scss" scoped>
    @import "../../css/showImage.scss";
</style>
