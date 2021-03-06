// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design'
import "view-design/dist/styles/iview.css"
import VueRouter from 'vue-router'
import vuescroll from 'vuescroll'
import axios from 'axios'
import VueAxios from 'vue-axios'
import echarts from 'echarts'

axios.defaults.withCredentials=true;

Vue.use(ViewUI);
Vue.use(vuescroll)
Vue.use(VueAxios,axios)

Vue.config.productionTip = false
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
