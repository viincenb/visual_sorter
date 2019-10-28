import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faPause, faBackward, faForward, faStepBackward, faStepForward, faRandom, faSync } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import store from './store'

library.add(faPlay)
library.add(faPause)
library.add(faBackward)
library.add(faForward)
library.add(faStepBackward)
library.add(faStepForward)
library.add(faRandom)
library.add(faSync)

Vue.component('font-awesome-icon', FontAwesomeIcon)

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
