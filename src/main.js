import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.config.productionTip = false

Vue.use(VueAxios, axios);
window.Vue = Vue;

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
