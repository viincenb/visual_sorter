import Sort from './Sort'

class Merge extends Sort {
  constructor () {
    super('Merge')
  }

  _move (numbers, push, from, to) {
    return push(numbers.move(from, to)).process()
  }

  _inspect (numbers, push, index) {
    const inspect = push(numbers.inspect(index))

    return inspect.process()
  }

  async _merge (numbers, push, a, b) {
    return new Promise(async (resolve, reject) => {
      let   indexToMove = a.min
      const rangeA = a.max - a.min + 1
      const rangeB = b.max - b.min + 1

      while (a.min <= a.max && b.min <= b.max) {
        const numberA = await this._inspect(numbers, push, a.min)
        const numberB = await this._inspect(numbers, push, b.min)

        if (numberA <= numberB) {
          await this._move(numbers, push, a.min, indexToMove++)
          a.min++
        }
        if (numberA > numberB) {
          await this._move(numbers, push, b.min, indexToMove++)
          b.min++
          a.min++
          a.max++
        }
      }

      resolve()
    })
  }

  async _sort (numbers, push, indexMin = 0, indexMax = numbers.length - 1) {
    return new Promise(async (resolve, reject) => {
      const range = (indexMin === indexMax) ? 1 : indexMax - indexMin + 1
      const midIndex = Math.floor(range / 2) + indexMin

      if (range === 0) {
        return resolve()
      }

      if (range === 2) {
        const inspectNumberA = push(numbers.inspect(indexMin))
        const numberA        = await inspectNumberA.process()
        const inspectNumberB = push(numbers.inspect(indexMax))
        const numberB        = await inspectNumberB.process()

        if (numberB < numberA) {
          const swap = push(numbers.swap(indexMin, indexMax))
          await swap.process()
        }
        return resolve()
      }

      if (range === 1) {
        const inspectNumber = push(numbers.inspect(indexMin))
        const number        = await inspectNumber.process()

        return resolve()
      }

      await this._sort(numbers, push, indexMin, midIndex)
      await this._sort(numbers, push, midIndex + 1, indexMax)

      await this._merge(numbers, push, { min: indexMin, max: midIndex }, { min: midIndex + 1, max: indexMax })

      resolve()
    })
  }

  async sort (numbers, push, indexMin = 0, indexMax = numbers.length - 1) {
    return this._sort(numbers, push, indexMin, indexMax)
  }
}

export default Merge
