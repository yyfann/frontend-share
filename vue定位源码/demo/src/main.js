import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './global-varies'

Vue.config.productionTip = false


import  "../open-source/client";


new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
