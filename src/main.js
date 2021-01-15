// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/index'

import axios from 'axios' // 引入axios
import './mock/mock' // 引入mockjs
import './libs/rem.js'

Vue.use(ElementUI)

// axios不能在其他组件中使用，所以讲axios改写为vue的原型属性
axios.defaults.baseURL = 'http://http://81.68.89.17:8000'
Vue.prototype.$http = axios // 组件进行数据请求时可以用this.$http.get().then()来实现

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
