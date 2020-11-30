<template>
  <div class='upload-image'>
    <div class='title'>
        <h1>{{title}}</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  data () {
    return {
      title: '上传图片'
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "../../css/uploadImage.scss";
</style>
