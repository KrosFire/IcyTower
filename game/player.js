class Player {
  constructor(x=100, y=584) {
    this.color = "#ff0000"
    this.height = 20
    this.width = 20

    this.jumping = true
    
    this.velocityX = 0
    this.velocityY = 0
    this.x = x
    this.y = y
    
    this.onPlatform = false

    this.sideBonus = false
    this.onBonus = false
  }

  jumpVelocity = () => {
    const bonus = this.sideBonus ? 30 : 0
    return 20 + 1.3*Math.abs(this.velocityX) + bonus
  }

  genColor = () => { 
    return "hsl(" + 360 * Math.random() + ',' +
               (80 + 20 * Math.random()) + '%,' + 
               (50 + 10 * Math.random()) + '%)'
  }

  jump = () => {

    if(!this.jumping) {
      this.color = this.genColor()

      this.velocityY -= this.jumpVelocity()

      this.jumping = true
      this.sideBonus = false
    }

  }

  moveLeft = () => {
    this.velocityX -= 2
  }

  moveRight = () => {
    this.velocityX += 2
  }

  update = () => {
    this.x += this.velocityX
    this.y += this.velocityY

    if (Math.abs(this.velocityX) < .05) {
      this.velocityX = 0
    }
    if (Math.abs(this.velocityY) < .05) {
      this.velocityY = 0
    }
  }
}