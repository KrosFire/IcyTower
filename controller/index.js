class Controller {

  constructor() {
    this.left = new ButtonInput()
    this.right = new ButtonInput()
    this.up = new ButtonInput()
    this.stop = new ButtonInput()
  }

  keyDownUp = (type, keyCode) => {
    const down = (type === "keydown")

    switch(keyCode) {
      case 37: 
        this.left.getInput(down)
        break
      case 32: 
        this.up.getInput(down)
        break
      case 39:
        this.right.getInput(down)
        break
      case 27:
        this.stop.getInput(down)
    }
  }
}
