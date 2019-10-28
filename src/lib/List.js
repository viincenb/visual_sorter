import Vue from 'vue'
import Action from './Action'

class List {
  constructor (numbers) {
    this._numbers = numbers
  }

  get length () {
    return this._numbers.length
  }

  inspect (i) {
    const action = new Action('inspect')
    const number = this._numbers[i]

    action.doFunction = done => {
      done(number)
    }

    action.data = i

    return action
  }

  _move (from, to) {
    const value = this._numbers[from]

    this._numbers.delete(from)
    this._numbers.insert(to, value)
  }

  move (from, to) {
    const action = new Action('move')

    action.data = {
      to
    }

    action.doFunction = done => {
      this._move(from, to)
      done()
    }
    action.undoFunction = done => {
      this._move(to, from)
      done()
    }

    return action
  }

  _set (index, value) {
    Vue.set(this._numbers, index, value)
  }

  _swap (iA, iB) {
    let a = this._numbers[iA]
    let b = this._numbers[iB]
    let tmp = a

    this._set(iA, b)
    this._set(iB, tmp)
  }

  swap (iA, iB) {
    const action = new Action('swap')

    action.data = {
      a: iA,
      b: iB
    }

    action.doFunction = done => {
      this._swap(iA, iB)
      done()
    }
    action.undoFunction = done => {
      this._swap(iA, iB)
      done()
    }

    return action
  }

  *[Symbol.iterator] () {
    for (let i in this._numbers) {
      const number = this._numbers[i]

      if (isNaN(number) === false) {
        this.inspect(i)
        yield number
      }
    }
  }
}

export default List
