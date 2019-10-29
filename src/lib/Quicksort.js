import Sort from './Sort'

class Quicksort extends Sort {
  constructor () {
    super('Quicksort')
  }

  async _quicksort (numbers, push, low, high) {
    return new Promise(async (resolve, reject) => {
      const pivotIndex = high
      const pivot = await this._inspect(numbers, push, pivotIndex)
      let   i = low - 1

      if (low >= high) {
        return resolve()
      }

      for (let j = low; j <= high; j++) {
        const number = await this._inspect(numbers, push, j)

        if (number < pivot) {
          await push(numbers.swap(++i, j)).process()
        }
      }

      await push(numbers.swap(++i, high)).process()
      await this._quicksort(numbers, push, low, i - 1)
      await this._quicksort(numbers, push, i + 1, high)

      resolve()
    })
  }

  async sort (numbers, push) {
    return this._quicksort(numbers, push, 0, numbers.length - 1)
  }
}

export default Quicksort
