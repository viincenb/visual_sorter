import Bubble from './Bubble'
import Selection from './Selection'
import Merge from './Merge'

class Sorter {
  constructor (numbers = []) {
    this._sort = null
    this.actions = []
    this._algorithms = {
      Bubble,
      Selection,
      Merge
    }
    this.numbers = numbers
  }

  set numbers (numbers) {
    this._numbers = numbers
  }

  get numbers () {
    return this._numbers
  }

  set sortAlgo (name) {
    const sortClass = this._algorithms[name]

    if (!sortClass) {
      return
    }
    this._sort = new sortClass
  }

  get sortAlgo () {
    return this._sort
  }

  sort (start) {
    this.sortAlgo.sort(this.numbers, start)
  }
}

export default Sorter
