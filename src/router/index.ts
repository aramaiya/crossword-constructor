import Vue from 'vue'
import Router from 'vue-router'
import Workspace from '@/components/workspace.vue'
import Home from '../components/home.vue'
Vue.use(Router)
import store from '../store/store'
const checkConfigValid = (to: any, from: any, next: any) => {
  store.dispatch("loadSessions").then(next);
}

export default new Router({
  routes: [
    {
      path: '/workspace/:session_id',
      name: 'Workspace',
      component: Workspace,
      beforeEnter: checkConfigValid
    },
    {
      path: '/',
      component: Home
    }
  ]
})

