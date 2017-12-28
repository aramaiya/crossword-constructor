import Vue from 'vue'
import Router from 'vue-router'
import Builder from '@/components/builder.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Builder',
      component: Builder
    }
  ]
})
