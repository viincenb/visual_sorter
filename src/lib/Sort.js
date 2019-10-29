class Sort {
  constructor (name) {
    if (!name) {
      throw new Error('Sort name is not defined')
    }
    this.name = name
    this._numbers = []
  }

  _move (numbers, push, from, to) {
    return push(numbers.move(from, to)).process()
  }

  _inspect (numbers, push, index) {
    const inspect = push(numbers.inspect(index))

    return inspect.process()
  }

  sort (numbers) {
    return []
  }
}

export default Sort
