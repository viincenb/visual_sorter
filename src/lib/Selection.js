import Sort from './Sort'

class Selection extends Sort {
  constructor () {
    super('Selection')
  }

  async sort (numbers, push) {
    let index = 0
    let min = {
      value: 0,
      index: -1
    }

    let sorted = true

    do {
      sorted = true
      for (let i = index; i < numbers.length; i++) {
        const inspectNumber   = push(numbers.inspect(i))
        const number          = await inspectNumber.process()

        if (number <= min.value || min.index < 0) {
          min.value = number
          min.index = i
          sorted = false
        }
      }
      if (min.index >= 0) {
        const move = push(numbers.move(min.index, index++))
        await move.process()
        min = {
          value: 0,
          index: -1
        }
      }
    } while (!sorted);
  }
}

export default Selection
