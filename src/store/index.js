import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showLegend: false,
    tick: 0,
    size: 100,
    initialNumbers: [],
    numbers: [],
    playDirection: 1,
    shouldStop: false,
    actionIndex: -1,
    actions: [],
    currentAlgoName: null,
    selectedBar: null,
    swappingBars: null,
    movingBar: null
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
