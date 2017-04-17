// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './common/css/base.css'
import 'common/css/table.min.css'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import ENV from '../config/env'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueResource)
Vue.http.options.root = ENV.api
// 测试环境
// Vue.http.options.root = 'http://pay-power-dev.oa.com/api'
// Vue.http.options.root = '/api'
Vue.http.interceptors.push((request, next) => {
  request.credentials = true
    // 请求前
  next((res) => {
    // 请求后
    if (res.body.error_code === -14) {
      window.location.href = 'http://sso.oa.com/Index/login/appid/1560'
    }
  })
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
