import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item)
}

Array.prototype.delete = function (index) {
  this.splice(index, 1)
}

new Vue({
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
