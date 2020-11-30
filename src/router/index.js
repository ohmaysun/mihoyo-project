import Vue from 'vue'
import Router from 'vue-router'

import RouterMain from '@/components/RouterMain'

import ShowImage from '@/components/ShowImage/ShowImage'
import UploadImage from '@/components/UploadImage/UploadImage'
import ImagesManagement from '@/components/ImagesManagement/ImagesManagement'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'RouterMain',
      component: RouterMain
    },
    {
      path: '/showImage',
      name: 'ShowImage',
      component: ShowImage
    },
    {
      path: '/UploadImage',
      name: 'UploadImage',
      component: UploadImage
    },
    {
      path: '/ImagesManagement',
      name: 'ImagesManagement',
      component: ImagesManagement
    }
  ]
})
