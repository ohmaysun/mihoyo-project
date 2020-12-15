<template>
  <div class='upload-image'>
    <div class='title'>
      <h1>{{title}}</h1>
    </div>
    <div class='img-files flex'>
      <label>请选择要上传的图片，最大不可超过 {{size}} 张</label>
      <div v-if='imgs.length>0' class='flex'>
        <div class='img-box' v-for='(item, i) in imgs' :key='i' >
          <img :src='item' alt=''> <span @click='del(i)'><i class='el-icon-delete'></i></span>
        </div>
      </div>
      <div class='img-file' v-if='imgs.length < size'>
        <input type='file' id='files' @change='fileChange'>
        <label for='files'>上传图片</label>
      </div>
    </div>
    <div class='button-box'>
      <el-button class='upload-btn' @click='upload' v-show='imgs.length>0'>上传</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  data () {
    return {
      title: '上传图片',
      imgs: [], // 图片预览地址
      imgfiles: [], // 图片原文件，上传到后台的数据
      size: 5 // 限制上传数量
    }
  },
  methods: {
    fileChange () { // 加入图片
      let that = this
      let event = window.event
      let file = event.target.files
      let len = file.length
      for (let i = 0; i < len; i++) {
        let reader = new FileReader() // 使用 FileReader 来获取图片路径及预览效果
        that.imgfiles.push(file[i])
        reader.readAsDataURL(file[i])
        reader.onload = function (e) {
          that.imgs.push(e.target.result) // base 64 图片地址形成预览
        }
      }
    },
    del (i) { // 根据下标删除
      this.imgfiles.splice(i, 1)
      this.imgs.splice(i, 1)
      console.log(this.imgs)
      console.log(this.imgfiles)
    },
    upload () { // 上传
      // todo
      console.log('upload')
    }
  }
}
</script>

<style lang='scss' scoped>
    @import '../../css/uploadImage.scss';
</style>
