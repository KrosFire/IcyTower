const playGame = () => {

  const app = document.getElementById("app")
  const scoreTable = document.getElementsByClassName("scoreTable")
  const popup = document.getElementById("popup")
  const btn = document.getElementById("play")
  popup.classList.remove("show")

  const displayPopup = () => {
    popup.classList.add("show")

    btn.addEventListener("click", playGame)
  }

  const keyDownUp = e => {
    controller.keyDownUp(e.type, e.keyCode)
  }

  const render = time => {
    const player = game.getPlayer() 

    display.fill(game.getBackgroundColor())
    display.drawRectangle(player.getPositionX(), player.getPositionY(), player.getWidth(), player.getHeight(), player.getColor())
    display.displayScore(game.getScore())
    
    // Display platforms
    for (let platform of game.getPlatforms()) {
      display.drawRectangle(platform.getPositionX(), platform.getPositionY(), platform.getLength(), platform.getWidth(), platform.getColor())
    }

    display.render()
  }

  const update = time => {
    const player = game.getPlayer()

    if (controller.stop.active) {
      engine.stop()
      console.log("STOP")
      return
    }
    if (controller.left.active) {
      player.moveLeft()
    }
    if (controller.right.active) {
      player.moveRight()
    }
    if (controller.up.active) {
      player.jump()
      controller.up.active = false
    }

    if(game.update()) {
      engine.stop()
      displayPopup()
      console.log("Game finished")
    }
  }

  const controller = new Controller()
  const display = new Display(app, scoreTable)
  const game = new Game()
  const engine = new Engine(1000/30, render, update)

  console.log(game)
  display.buffer.canvas.height = Game.height
  display.buffer.canvas.width = Game.width

  window.addEventListener("keydown", keyDownUp)
  window.addEventListener("keyup", keyDownUp)

  engine.start()
}


window.addEventListener("load", playGame) 