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
    display.fill(game.backgroundColor)
    display.drawRectangle(game.player.x, game.player.y, game.player.width, game.player.height, game.player.color)
    display.displayScore(game.score)
    
    // Display platforms
    for (let platform of game.platforms) {
      display.drawRectangle(platform.x, platform.y, platform.length, platform.width, platform.color)
    }

    display.render()
  }

  const update = time => {
    if (controller.stop.active) {
      engine.stop()
      console.log("STOP")
      return
    }
    if (controller.left.active) {
      game.player.moveLeft()
    }
    if (controller.right.active) {
      game.player.moveRight()
    }
    if (controller.up.active) {
      game.player.jump()
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
  display.buffer.canvas.height = game.height
  display.buffer.canvas.width = Game.width

  window.addEventListener("keydown", keyDownUp)
  window.addEventListener("keyup", keyDownUp)

  engine.start()
}


window.addEventListener("load", playGame) 