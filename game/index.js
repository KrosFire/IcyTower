export default class Game {

  static get width() {return 300}

  constructor() {
    this.backgroundColor = "#000"
    this.start = false
    
    this.friction = 0.9
    this.gravity = 3

    this.player = new Game.Player(100, 560)
    
    this.height = 600

    this.platformWidth = 15
    this.platforms = []

    // The base Platform
    this.generateBasePlatform(this.height-this.platformWidth)

    // Generate initial platforms
    for (let i=10; i>0; i-=1) {
      const length = Math.random() * (Game.width/3) + 40
      const left = Math.random() * (2*Game.width/3)
      this.generatePlatform(length, left, i*(this.height/11))
    }
  }

  generatePlatform = (length, left, top) => {
    const platform = new Platform(length, left, top, this.platformWidth)
    this.platforms.push(platform)
  }

  generateBasePlatform = (top) => {
    const platform = new LevelPlatform(top, this.platformWidth)
    this.platforms.push(platform)
  }

  collideObject = object => {
    // Left/Right
    if (object.x < 0) {
      object.x = 0
      object.velocityX = 0
      object.jumping = false
      object.sideBonus = true
    } else if (object.x + object.width > Game.width) {
      object.x = Game.width - object.width
      object.velocityX = 0
      object.jumping = false
      object.sideBonus = true 
    } else if(object.x > 0 && object.x + object.width < Game.width) {
      object.sideBonus = false
    }

    // Platforms
    if (!object.onPlatform) {
      for (let platform of this.platforms) {
        // Check current tick
        const current = object.y+object.height === platform.y && object.velocityY >= 0
        // Check next tick
        const next = (object.y+object.height) <= platform.y && (object.y+object.height+object.velocityY) >= platform.y
        
        
        if (current || next) {
          if (object.x+object.width >= platform.x && object.x <= platform.x+platform.length) {
            object.jumping = false
            object.onPlatform = true
            object.y = platform.y-object.height
            object.velocityY = platform.velocityY

            if (!this.start && !(platform instanceof LevelPlatform) ) {
              this.start = true
            }

            return false
          } else {
            object.jumping = true
          }
        }
      }
    } else if(object.velocityX !== 0 || object.velocityY !== this.platforms[0].velocityY) {
      object.onPlatform = false
    }

    // Bottom 
    if (object.y >= this.height) {
      object.jumping = false
      object.y = this.height - object.height
      object.velocityY = 0

      console.log("GROUND!!!")
      return true
    }

    return false
  }

  update = () => {

    if (!this.player.onPlatform) {
      this.player.velocityY += this.gravity
      this.player.velocityY *= this.friction
    }

    this.player.velocityX *= this.friction

    this.player.velocityX = Math.round(this.player.velocityX * 1000)/ 1000
    this.player.velocityY = Math.round(this.player.velocityY * 1000)/ 1000
    
    for (let platform of this.platforms) {

      if (this.start) {
        platform.velocityY = 3
      }

      if (platform.y > this.height) {
        this.platforms.shift()

        const length = (Math.random() * (Game.width/3)) + 30
        const left = Math.random() * (2*Game.width/3)
        this.generatePlatform(length, left, 0)
      }
    }

    const finish = this.collideObject(this.player)

    this.player.update()

    for (let platform of this.platforms) {
      platform.update()
    }

    return finish
  }
}

Game.Player = class Player {
  constructor(x=100, y=584) {
    this.color = "#ff0000"
    this.height = 16
    this.jumping = true
    this.velocityX = 0
    this.velocityY = 0
    this.width = 16
    this.x = x
    this.y = y
    this.onPlatform = false

    this.sideBonus = false
  }

  jumpVelocity = () => {
    const bonus = this.sideBonus ? 30 : 0
    return 30 + 1.3*Math.abs(this.velocityX) + bonus
  }

  jump = () => {
    if(!this.jumping) {
      this.color = `#${Math.floor(Math.random() * 16777216).toString(16)}`
      
      if(this.color.length != 7) {
        this.color = this.color.slice(0,1) + "0" + this.color.slice(1, 6)
      }

      this.velocityY -= this.jumpVelocity()

      this.jumping = true
      this.sideBonus = false
    }

  }

  moveLeft = () => {
    this.velocityX -= 1.5
  }

  moveRight = () => {
    this.velocityX += 1.5
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

class Platform {
  
  constructor(length, x, y, width=10) {
    this.length = length
    this.x = x
    this.y = y
    this.width = width
    this.color = "#008EFF"
    this.velocityY = 0
  }

  moveDown = velocity => {
    this.velocityY = velocity
  }

  update = () => {
    this.y += this.velocityY
  }

}

class LevelPlatform extends Platform {

  constructor(y, width=10) {
    super(Game.width, 0, y, width)
  }

}