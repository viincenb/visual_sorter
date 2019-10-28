class Action {
  constructor (name) {
    this.name = name
    this.data = null
    this.doFunction = () => {}
    this.undoFunction = () => {}
    this.after = () => {}
    this.before = () => {}
  }

  do () {
    this.before()
    this.doFunction(data => {
      this._after(data)
      this.after()
    })
  }

  process () {
    return new Promise((resolve, reject) => {
      this._after = resolve
    })
  }

  undo () {
    this.before()
    this.undoFunction(data => {
      this.after()
    })
  }
}

export default Action
