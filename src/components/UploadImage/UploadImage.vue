<template>
  <div class='upload-image'>
    <div class='title'>
      <h1>{{title}}</h1>
    </div>
    <div class='img-files flex'>
      <label>请选择要上传的图片(仅限jpg/png/gif格式)，最多不可超过 {{size}} 张</label>
      <div v-if='imgs.length>0' class='flex'>
        <div class='img-box' v-for='(item, i) in imgs' :key='i' >
          <img :src='item' alt=''> <span @click='del(i)'><i class='el-icon-delete'></i></span>
        </div>
      </div>
      <div class='img-file' v-if='imgs.length < size'>
        <input type='file' id='files' accept='image/png,image/gif,image/jpeg' @change='fileChange' ref='file'/>
        <label for='files'>上传图片</label>
      </div>
    </div>
    <div class='button-box'>
      <el-button class='upload-btn' @click='upload' v-show='imgs.length>0'>上传</el-button>
    </div>
    <el-dialog class='dialog' title='提示' :visible.sync='dialogVisible' :before-close='handleClose'>
      <span>{{tip}}</span>
      <span slot='footer' class='dialog-footer'>
        <div class='button-box'>
          <div class='btn' @click='dialogVisible = false'>继续上传</div>
        </div>
        <div class='button-box'>
          <router-link class='btn' to='/showImage'>返回列表页</router-link>
        </div>
      </span>
    </el-dialog>
    <transition name='fade'>
      <Loading v-if='isLoading'></Loading>
    </transition>
  </div>
</template>

<script>
import Loading from '@/components/Loading/Loading'
export default {
  name: 'UploadImage',
  components: {
    Loading
  },
  data () {
    return {
      title: '上传图片',
      imgs: [], // 图片预览地址
      imgfiles: [], // 图片原文件，上传到后台的数据
      size: 5, // 限制上传数量
      isLoading: false, // 是否显示loading
      dialogVisible: false, // 是否显示dialog，用来控制弹框的显示隐藏
      tip: '' // 操作信息
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
        reader.onload = (e) => {
          that.imgs.push(e.target.result) // base 64 图片地址形成预览
          // e.target.result  就是从本地读取的图片的base64格式,将它上传给服务器即可
          // 使用axios的post方法上传即可
        }
      }
    },
    del (i) { // 根据下标删除
      this.imgfiles.splice(i, 1)
      this.imgs.splice(i, 1)
      // console.log(this.imgs)
      // console.log(this.imgfiles)
    },
    upload () { // 上传
      // 上传前显示loading动画
      this.isLoading = true
      // todo
      // console.log(this.imgs)
      // console.log(this.imgfiles)
      let that = this
      // let formData = new FormData()
      // formData.append('uploadFiles', imgfiles)
      /* eslint-disable no-undef */
      let formData = new FormData() // 创建form对象
      /*
      * formdata存file。 先从上传单图尝试
      formData.append('file', this.imgfiles[0]) // 通过append向form对象添加数据
      console.log(formData.get('file'))
      */
      /*
      * formdata存files
      // formData重复的往一个值添加数据并不会被覆盖掉，可以全部接收到，可以通过formData.getAll('files')来查看所有插入的数据
      */
      for (let i = 0; i < this.imgfiles.length; i++) {
        formData.append('files', this.imgfiles[i])
      }
      // console.log(formData.getAll('files')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      // 可以继续添加form表单中其他数据
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      // 这里是服务器接口地址
      // let url = 'http://127.0.0.1:8000/uploadImages'
      let url = 'http://81.68.89.17:8000/uploadImages'
      this.$http.post(url, formData, config)
        .then(response => {
          console.log(response)
          if (response.data.code === 200) {
            that.tip = '保存成功'
            console.log('上传成功')
            // todo 保存成功后，提示用户是否继续上传，还是返回列表页
            that.imgs = []
            that.imgfiles = []
          } else {
            that.tip = '保存失败'
            console.log('上传失败')
            that.imgs = []
            that.imgfiles = []
          }
        })
        .then(res => {
          // 上传完取消loading动画
          that.isLoading = false
          // 显示dialog
          that.dialogVisible = true
        })
    },
    // 点击弹窗的继续上传按钮
    continueBtn () {
      // 弹窗提示字样清空
      this.tip = ''
      // 关闭弹窗
      this.dialogVisible = false
      // 清空要上传的图片
      this.imgs = []
      this.imgfiles = []
    },
    // 弹窗关闭
    handleClose (done) {
      this.$confirm('确定关闭吗').then(() => {
        // function(done)，done 用于关闭 Dialog
        done()
        console.info('点击右上角 X ，取消按钮或遮罩层时触发')
      }).catch(() => {
        console.log('点击确定时触发')
      })
    }
  }
}
</script>

<style lang='scss' scoped>
    @import '../../css/uploadImage.scss';
</style>
