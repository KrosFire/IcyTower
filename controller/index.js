class Controller {

  constructor() {
    this.left = new Controller.ButtonInput()
    this.right = new Controller.ButtonInput()
    this.up = new Controller.ButtonInput()
    this.stop = new Controller.ButtonInput()
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

Controller.ButtonInput = class BtnInput {
  active = false
  down = false

  getInput = down => {
    if (this.down != down) this.active = down
    this.down = down
  }
}