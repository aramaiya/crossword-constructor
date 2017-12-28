// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {$cellModel} from './models/cell-model'

Vue.config.productionTip = false

$cellModel.initialize(15,15);

Vue.prototype.$hey = 'hey';
let het = 'hey';
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
