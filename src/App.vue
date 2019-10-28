<template>
  <div id="app">
    <input v-model="tick" type="number">
    <input v-model="size" @change="shuffle" type="number">
    <select v-model="algorithm">
      <option v-for="algoName in algorithms" :key="algoName" :value="algoName">{{algoName}}</option>
    </select>
    <button @click="reset">Reset</button>
    <button @click="shuffle">Shuffle</button>
    <button @click="undoAction">Undo</button>
    <button @click="rewind">Rewind</button>
    <button @click="play">Play</button>
    <button @click="stop">Stop</button>
    <button @click="doAction">Do</button>
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
        :style="`width: ${1 / numbers.length * 100}%; height: ${number}pt`"
      >
        <div v-if="showLegend" class="bar-legend">{{number}}</div>
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
      actionIndex: -1,
      actions: [],
      currentAlgoName: null,
      selectedBar: null,
      swappingBars: null,
      movingBar: null
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
        this.initialNumbers.push(Math.floor(Math.random() * 500 + 10))
      }
      this.reset()
    },
    resetBars () {
      this.selectedBar = null
      this.swappingBars = null
      this.movingBar = null
    },
    reset () {
      this.actions = []
      this.actionIndex = -1
      this.numbers = new List(this.initialNumbers.slice(0).reverse())
      this.resetBars()

      const sorter = new Sorter(this.numbers)

      this.sorter = sorter
      sorter.sortAlgo = this.currentAlgoName
      sorter.sort(action => {

        if (action.name === 'inspect') {
          action.before = () => {
            this.resetBars()
            const id = action.data

            this.selectedBar = id
          }
        }

        if (action.name === 'swap') {
          action.before = () => {
            this.resetBars()
            this.swappingBars = { a: action.data.a, b: action.data.b }
          }
        }

        if (action.name === 'move') {
          action.before = () => {
            this.resetBars()
            this.movingBar = action.data.to
          }
        }

        this.actions.push(action)
        return action
      })
    },
    stop () {
      this.shouldStop = true
    },
    rewind () {
      this.playDirection = -1
      this._play()
    },
    play () {
      this.playDirection = 1
      this._play()
    },
    _play () {
      if (this.shouldStop) {
        this.shouldStop = false
        return
      }
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.bar {
  background: #808080;
  transition: height .2s ease;

  .bar-legend {
    transform: rotate(-90deg);
    position: relative;
    top: 1em;
    display: inline-block;
  }

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

.row {
  display: flex;
  flex-direction: row;
}

.jcenter {
  justify-content: center;
}
</style>
