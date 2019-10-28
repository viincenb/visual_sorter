import Sort from './Sort'

class Bubble extends Sort {
  constructor () {
    super('Bubble')
  }

  async sort (numbers, push) {
    for (let i = 0; i < numbers.length; i++) {
      const inspectNumber   = push(numbers.inspect(i))
      const number          = await inspectNumber.process()
      const inspectNumberB  = push(numbers.inspect(i + 1))
      const numberB         = await inspectNumberB.process()

      if (numberB < number) {
        const swap = push(numbers.swap(i, i + 1))
        await swap.process()
        i = -1
      }
    }
  }
}

export default Bubble
