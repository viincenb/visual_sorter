class Action {
  constructor (name) {
    this.name = name
    this.data = null
    this.doFunction = done => done()
    this.undoFunction = done => done()
    this.after = () => {}
    this.before = () => {}
    this.afterUndo = () => {}
    this.beforeUndo = () => {}
    this.afterDo = () => {}
    this.beforeDo = () => {}
  }

  do () {
    this.before()
    this.beforeDo()
    this.doFunction(data => {
      this._after(data)
      this.after()
      this.afterDo()
    })
  }

  process () {
    return new Promise((resolve, reject) => {
      this._after = resolve
    })
  }

  undo () {
    this.before()
    this.beforeUndo()
    this.undoFunction(data => {
      this.after()
      this.afterUndo()
    })
  }
}

export default Action
