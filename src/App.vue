<template>
  <div id="app">
    <div class="toolbar">
      <div class="main">
        <input v-model="tick" type="number">
        <input v-model="size" @change="shuffle" type="number">
        <select v-model="algorithm">
          <option v-for="algoName in algorithms" :key="algoName" :value="algoName">{{algoName}}</option>
        </select>
        <button class="button transparent" @click="reset"><font-awesome-icon :icon="['fas', 'sync']" /></button>
        <button class="button transparent" @click="shuffle"><font-awesome-icon :icon="['fas', 'random']" /></button>
        <button class="button transparent" @click="undoAction"><font-awesome-icon :icon="['fas', 'step-backward']" /></button>
        <button class="button transparent" :class="{ active: playDirection === -1 }" @click="rewind"><font-awesome-icon :icon="['fas', 'backward']" /></button>
        <button class="button transparent" v-if="!running" @click="play"><font-awesome-icon :icon="['fas', 'play']" /></button>
        <button class="button transparent" v-if="running" @click="stop"><font-awesome-icon :icon="['fas', 'pause']" /></button>
        <button class="button transparent" :class="{ active: playDirection === 1 }" @click="forward"><font-awesome-icon :icon="['fas', 'forward']" /></button>
        <button class="button transparent" @click="doAction"><font-awesome-icon :icon="['fas', 'step-forward']" /></button>
      </div>

      <div class="subbar">
        <div class="legend inspect">{{inspectsCount}}</div>
        <div class="legend swap">{{swapsCount}}</div>
        <div class="legend move">{{movesCount}}</div>
      </div>
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
        return ['Merge', 'Bubble', 'Selection', 'Quicksort']
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
        this.initialNumbers.push(Math.random() * 100)
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
    this.algorithm = 'Quicksort'
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
  font-family: Roboto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.toolbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  display: flex;
  flex-direction: column;

  .main {
    background: #222;
    padding: 1em 0;
    display: flex;
    justify-content: center;

    & > * {
      margin: 0 .2em;
    }
  }

  .subbar {
    display: flex;
    flex-direction: row;
    justify-content: center;

    & > .legend {
      margin: 0 .2em;
      min-width: 20pt;
      min-height: 20pt;
      line-height: 20pt;
      text-align: center;
      border-radius: 25pt;
      padding: .2em .5em;
      font-weight: 500;
    }
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
  padding-top: 7em;
}

.jcenter {
  justify-content: center;
}

.button {
  height: 2.5em;
  border: 0 none;
  padding: 0 1em;
  border-radius: 2pt;
  cursor: pointer;

  &.transparent {
    background: transparent;
    color: #fff;

    &.active {
      background: #000;
    }
  }
}
</style>
