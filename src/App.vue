<template>
  <div id="app">
    <div class="toolbar">
      <span><span class="legend inspect"></span>{{inspectsCount}}</span>
      <span><span class="legend swap"></span>{{swapsCount}}</span>
      <span><span class="legend move"></span>{{movesCount}}</span>
      <input v-model="tick" type="number">
      <input v-model="size" @change="shuffle" type="number">
      <select v-model="algorithm">
        <option v-for="algoName in algorithms" :key="algoName" :value="algoName">{{algoName}}</option>
      </select>
      <button @click="reset"><font-awesome-icon :icon="['fas', 'sync']" /></button>
      <button @click="shuffle"><font-awesome-icon :icon="['fas', 'random']" /></button>
      <button @click="undoAction"><font-awesome-icon :icon="['fas', 'step-backward']" /></button>
      <button @click="rewind"><font-awesome-icon :icon="['fas', 'backward']" /></button>
      <button v-if="!running" @click="play"><font-awesome-icon :icon="['fas', 'play']" /></button>
      <button v-if="running" @click="stop"><font-awesome-icon :icon="['fas', 'pause']" /></button>
      <button @click="forward"><font-awesome-icon :icon="['fas', 'forward']" /></button>
      <button @click="doAction"><font-awesome-icon :icon="['fas', 'step-forward']" /></button>
    </div>
    <div class="row jcenter">
      <div
        v-for="(number, index) in numbers"
        :key="index"
        class="bar"
        :class="{
          focus: selectedBar === index,
          moved: movingBar === index,
          swap: swappingBars && (swappingBars.a === index || swappingBars.b === index)
        }"
        :style="`width: ${1 / numbers.length * 100}%; height: ${number}%`"
      >
      </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Sorter from './lib/Sorter'
import List from './lib/List'

export default {
  name: 'app',
  components: {
    HelloWorld
  },
  data () {
    return {
      showLegend: false,
      tick: 0,
      size: 100,
      initialNumbers: [],
      numbers: [],
      playDirection: 1,
      shouldStop: false,
      running: false,
      actionIndex: -1,
      actions: [],
      currentAlgoName: null,
      selectedBar: null,
      swappingBars: null,
      movingBar: null,
      inspectsCount: 0,
      movesCount: 0,
      swapsCount: 0
    }
  },
  computed : {
    algorithms: {
      get () {
        return ['Merge', 'Bubble', 'Selection']
      }
    },
    algorithm: {
      get () {
        return this.currentAlgoName
      },
      set (value) {
        this.currentAlgoName = value
        this.reset()
      }
    }
  },
  methods: {
    shuffle () {
      this.initialNumbers = []
      for (let i = 0; i < this.size; i++) {
        this.initialNumbers.push(Math.floor(Math.random() * 100))
      }
      this.reset()
    },
    resetBars () {
      this.selectedBar = null
      this.swappingBars = null
      this.movingBar = null
    },
    async reset () {
      this.actions = []
      this.actionIndex = -1
      this.numbers = new List(this.initialNumbers.slice(0).reverse())
      this.playDirection = 1
      this.running = false
      this.shouldStop = false
      this.inspectsCount = 0
      this.swapsCount = 0
      this.movesCount = 0
      this.resetBars()

      const sorter = new Sorter(this.numbers)

      this.sorter = sorter
      sorter.sortAlgo = this.currentAlgoName
      await sorter.sort(action => {

        if (action.name === 'inspect') {
          action.before = () => {
            this.resetBars()
            const id = action.data

            this.selectedBar = id
          }
          action.afterDo = () => {
            this.inspectsCount++
          }
          action.afterUndo = () => {
            this.inspectsCount--
          }
        }

        if (action.name === 'swap') {
          action.before = () => {
            this.resetBars()
            this.swappingBars = { a: action.data.a, b: action.data.b }
          }
          action.afterDo = () => {
            this.swapsCount++
          }
          action.afterUndo = () => {
            this.swapsCount--
          }
        }

        if (action.name === 'move') {
          action.before = () => {
            this.resetBars()
            this.movingBar = action.data.to
          }
          action.afterDo = () => {
            this.movesCount++
          }
          action.afterUndo = () => {
            this.movesCount--
          }
        }

        this.actions.push(action)
        return action
      })
    },
    stop () {
      this.shouldStop = true
      this.running = false
    },
    rewind () {
      this.playDirection = -1
    },
    forward () {
      this.playDirection = 1
    },
    play () {
      this.shouldStop = false
      this._play()
    },
    _play () {
      if (this.shouldStop) {
        this.running = false
        this.shouldStop = false
        return
      }
      this.running = true
      setTimeout(() => {
        const action = this.playDirection === 1 ? this.doAction : this.undoAction

        if (action()) {
          this._play()
        }
      }, this.tick)
    },
    doAction () {
      const action = this.actions[++this.actionIndex]

      if (action) {
        action.do()
        return true
      }
      this.actionIndex--
      return false
    },
    undoAction () {
      const action = this.actions[this.actionIndex--]

      if (action) {
        action.undo()
        return true
      }
      this.actionIndex++
      return false
    }
  },
  created () {
    this.algorithm = 'Merge'
    this.shuffle()
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background: #222;

  &, a * {
    color: #fff;
  }
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.toolbar {
  background: #222;
  padding: 1em 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  display: flex;
  justify-content: center;

  & > * {
    margin: 0 .2em;
  }
}

.bar {
  background: #808080;
  transition: height .2s ease;

  &.focus {
    background: red;
  }

  &.swap {
    background: blue;
  }

  &.moved {
    background: black;
  }
}

.legend {
  display: inline-block;
  width: 1em;
  height: 1em;

  &.inspect {
    background: red;
  }

  &.swap {
    background: blue;
  }

  &.move {
    background: black;
  }
}

.row {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  height: 100vh;
  padding-top: 4em;
}

.jcenter {
  justify-content: center;
}
</style>
