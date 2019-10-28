class Sort {
  constructor (name) {
    if (!name) {
      throw new Error('Sort name is not defined')
    }
    this.name = name
    this._numbers = []
  }

  sort (numbers) {
    return []
  }
}

export default Sort
