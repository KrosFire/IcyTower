export default class Game {

  static get width() {return 300}

  constructor() {
    this.backgroundColor = "#000"
    this.start = false
    this.gameOver = false
    
    this.friction = 0.9
    this.gravity = 3

    this.player = new Game.Player(100, 560)
    
    this.height = 600

    this.platformWidth = 15
    this.platforms = []

    this.score = 0

    // The base Platform
    this.generateBasePlatform(0, this.height-this.platformWidth)

    // Generate initial platforms
    for (let i=10; i>0; i-=1) {
      const left = Math.random() * (2*Game.width/3)
      this.generatePlatform(11-i, left, i*(this.height/11))
    }
  }

  getAccordingPlatform = (score, left, top, platformWidth) => {
    if (score < 50) {
      const length = Math.random() * Platform.maxLength+ Platform.minLength
      return new Platform(score, length, left, top, platformWidth)
    }
    else if (score < 100) { 
      const length = Math.random() * StandardPlatform.maxLength+ StandardPlatform.minLength
      return new StandardPlatform(score, length, left, top, platformWidth)
    } else if (score < 150) {
      const length = Math.random() * IntermediatePlatform.maxLength+ IntermediatePlatform.minLength
      return new IntermediatePlatform(score, length, left, top, platformWidth)
    } else if (score < 200) {
      const length = Math.random() * AdvancedPlatform.maxLength+ AdvancedPlatform.minLength
      return new AdvancedPlatform(score, length, left, top, platformWidth)
    } else {
      const length = Math.random() * ExpertPlatform.maxLength+ ExpertPlatform.minLength
      return new ExpertPlatform(score, length, left, top, platformWidth)
    }
  }

  generatePlatform = (score, left, top) => {
    const platform = this.getAccordingPlatform(score, left, top, this.platformWidth)
    this.platforms.push(platform)
  }

  generateBasePlatform = (score, top) => {
    let color = ""
    
    switch (score) {
      case 0: 
        color = Platform.color
        break
      case 50:
        color = StandardPlatform.color 
        break 
      case 100:
        color = IntermediatePlatform.color
        break
      case 150:
        color = AdvancedPlatform.color
        break
      default:
        color = ExpertPlatform.color
        break
    }

    const platform = new LevelPlatform(score, top, color, this.platformWidth)
    this.platforms.push(platform)
  }

  collideObject = object => {

    // Left/Right
    if (object.x < 0) {
      object.x = 0

      if (object.jumping && !object.onBonus) {
        object.velocityX = -object.velocityX
        object.velocityY = -Math.abs(object.velocityX)*2
        object.sideBonus = true
      } else {
        object.velocityX = 0
      }

      object.onBonus = true
    } else if (object.x + object.width > Game.width) {
      object.x = Game.width - object.width
      
      if (object.jumping && !object.onBonus) {
        object.velocityX = -object.velocityX
        object.velocityY = -Math.abs(object.velocityX)*2
        object.sideBonus = true
      } else {
        object.velocityX = 0
      }

      object.onBonus = true
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
            object.onBonus = false
            object.y = platform.y-object.height
            object.velocityY = platform.velocityY

            if (!this.start && !(platform instanceof LevelPlatform) ) {
              this.start = true
            }

            if(this.start && platform.score > this.score) {
              this.score = platform.score
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

      this.gameOver = true
      return true
    }

    return false
  }

  update = () => {
    // Setup the next tick

    if (!this.player.onPlatform) {
      this.player.velocityY += this.gravity
      this.player.velocityY *= this.friction
    }

    this.player.velocityX *= this.friction

    // Round the numbers down to .001
    this.player.velocityX = Math.round(this.player.velocityX * 1000)/ 1000
    this.player.velocityY = Math.round(this.player.velocityY * 1000)/ 1000
    
    // Setup platforms
    const lastPlatform = this.platforms[this.platforms.length-1]
    for (let platform of this.platforms) {
      if (this.start) {
        if (lastPlatform.score < 50) {
          platform.velocityY = Platform.speed
        } else if (lastPlatform.score < 100) {
          platform.velocityY = StandardPlatform.speed
        } else if (lastPlatform.score < 150) {
          platform.velocityY = IntermediatePlatform.speed
        } else if (lastPlatform.score < 200) {
          platform.velocityY = AdvancedPlatform.speed
        } else {
          platform.velocityY = ExpertPlatform.speed
        }
      }

      if (platform.y > this.height) {
        this.platforms.shift()
      
        if (lastPlatform.score % 50 === 49) {
          this.generateBasePlatform(lastPlatform.score+1, 0)
        } else {
          const left = Math.random() * (2*Game.width/3)
          this.generatePlatform(lastPlatform.score+1, left, 0)
        } 
      }
    }

    // Check collisions in next tick and act accordingly
    const finish = this.collideObject(this.player)

    // Update elements
    this.player.update()

    for (let platform of this.platforms) {
      platform.update()
    }

    // Return game state
    return finish
  }
}

Game.Player = class Player {
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
      // this.color = `#${Math.floor(Math.random() * 16777216).toString(16)}`
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

class Platform {

  static get minLength() {return 60}
  static get maxLength() {return Game.width/3}
  static get speed() {return 2}
  static get color() {return "#008EFF"}
  
  constructor(score, length, x, y, width=10, velocity=0) {
    this.length = length
    this.x = x
    this.y = y
    this.width = width
    this.color = Platform.color
    this.velocityY = velocity
    this.score = score
  }

  update = () => {
    this.y += this.velocityY
  }

}

class StandardPlatform extends Platform {

  static get minLength() {return 50}
  static get maxLength() {return Game.width/3}
  static get speed() {return 2.5}
  static get color() {return "#9704d6"}

  constructor(score, length, x, y, width=10, velocity=0) {
    super(score, length, x, y, width, velocity)
    this.color = StandardPlatform.color
  }
}

class IntermediatePlatform extends Platform {
  static get minLength() {return 40}
  static get maxLength() {return Game.width/3}
  static get speed() {return 3}
  static get color() {return "#13ef21"}

  constructor(score, length, x, y, width=10, velocity=0) {
    super(score, length, x, y, width, velocity)
    this.color = IntermediatePlatform.color
  }
}

class AdvancedPlatform extends Platform {
  static get minLength() {return 30}
  static get maxLength() {return Game.width/4}
  static get speed() {return 3.5}
  static get color() {return "#ef1334"}

  constructor(score, length, x, y, width=10, velocity=0) {
    super(score, length, x, y, width, velocity)
    this.color = AdvancedPlatform.color
  }
}

class ExpertPlatform extends Platform {
  static get minLength() {return 30}
  static get maxLength() {return Game.width/4.5}
  static get speed() {return 5}
  static get color() {return "#ffff14"}

  constructor(score, length, x, y, width=10, velocity=0) {
    super(score, length, x, y, width, velocity)
    this.color = ExpertPlatform.color
  }
}

class LevelPlatform extends Platform {

  constructor(score, y, color="#fc50ee", width=10) {
    super(score, Game.width, 0, y, width)
    this.color = color
  }

}