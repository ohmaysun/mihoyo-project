<template>
  <!-- 动态注册路由 -->
  <div class='hello'>
    <div class='title'>
        <h1>{{title}}</h1>
    </div>
    <ul>
      <li>
        <router-link to='/showImage'>图片展示</router-link>
      </li>
      <li>
        <router-link to='/uploadImage'>图片上传</router-link>
      </li>
      <li>
        <router-link to='/imagesManagement'>图片管理</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MainRouter',
  data () {
    return {
      title: '图片浏览、上传、管理demo'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
