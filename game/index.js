class Game {
  #backgroundColor
  #start
  #gameOver
  #friction
  #gravity
  #player
  #platformWidth
  #platforms
  #score

  static get width() {return 300}
  static get height() {return 600}

  constructor() {
    this.#backgroundColor = "#000"
    this.#start = false
    this.#gameOver = false
    this.#friction = 0.9
    this.#gravity = 3
    this.#player = new Player(100, 560)
    this.#platformWidth = 15
    this.#platforms = []
    this.#score = 0

    // The base Platform
    this.generateBasePlatform(0, Game.height-this.#platformWidth)

    // Generate initial platforms
    for (let i=10; i>0; i-=1) {
      const left = Math.random() * (2*Game.width/3)
      this.generatePlatform(11-i, left, i*(Game.height/11))
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
    const platform = this.getAccordingPlatform(score, left, top, this.#platformWidth)
    this.#platforms.push(platform)
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

    const platform = new LevelPlatform(score, top, color, this.#platformWidth)
    this.#platforms.push(platform)
  }

  collideObject = object => {

    // Left/Right
    if (object.getPositionX() < 0) {
      object.setPositionX(0)

      if (object.isJumping() && !object.getSideBonus()) {
        object.setVelocityX(-object.getVelocityX())
        object.setVelocityY(-Math.abs(object.getVelocityX())*2)
      } else {
        object.setVelocityX(0)
      }

      object.setSideBonus(true)
    } else if (object.getPositionX() + object.getWidth() > Game.width) {
      object.setPositionX(Game.width - object.getWidth())
      
      if (object.isJumping() && !object.getSideBonus()) {
        object.setVelocityX(-object.getVelocityX())
        object.setVelocityY(-Math.abs(object.getVelocityX())*2)
        object.setSideBonus(true)
      } else {
        object.setVelocityX(0)
      }

      object.setSideBonus(true)
    }

    // Platforms
    if (!object.isOnPlatform()) {
      for (let platform of this.#platforms) {
        // Check current tick
        const current = object.getPositionY()+object.getHeight() === platform.getPositionY() && object.getVelocityY() >= 0
        // Check next tick
        const next = (object.getPositionY()+object.getHeight()) <= platform.getPositionY() && (object.getPositionY()+object.getHeight()+object.getVelocityY()) >= platform.getPositionY()
        
        if (current || next) {
          if (object.getPositionX()+object.getWidth() >= platform.getPositionX() && object.getPositionX() <= platform.getPositionX()+platform.getLength()) {
            object.setJumping(false)
            object.setOnPlatform(true)
            object.setSideBonus(false)
            object.setPositionY(platform.getPositionY()-object.getHeight())
            object.setVelocityY(platform.getVelocityY())

            if (!this.#start && !(platform instanceof LevelPlatform) ) {
              this.#start = true
            }

            if(this.#start && platform.getScore() > this.#score) {
              this.#score = platform.getScore()
            }

            return false
          } else {
            object.setJumping(true)
          }
        }
      }
    } else if(object.getVelocityX !== 0 || object.getVelocityY() !== this.#platforms[0].getVelocityY()) {
      object.setOnPlatform(false)
    }

    // Bottom 
    if (object.getPositionY() >= Game.height) {
      object.setJumping(false)
      object.setPositionY(Game.height - object.getHeight())
      object.setVelocityY(0)

      this.#gameOver = true
      return true
    }

    return false
  }

  update = () => {
    // Setup the next tick

    if (!this.#player.isOnPlatform()) {
      this.#player.setVelocityY(this.#player.getVelocityY() + this.#gravity)
      this.#player.setVelocityY(this.#player.getVelocityY() * this.#friction)
    }

    this.#player.setVelocityX(this.#player.getVelocityX()*this.#friction)

    // Round the numbers down to .001
    this.#player.setVelocityX(Math.round(this.#player.getVelocityX() * 1000)/ 1000)
    this.#player.setVelocityY(Math.round(this.#player.getVelocityY() * 1000)/ 1000)
    
    // Setup platforms
    const lastPlatform = this.#platforms[this.#platforms.length-1]
    for (let platform of this.#platforms) {
      if (this.#start) {
        if (lastPlatform.getScore() < 50) {
          platform.setVelocityY(Platform.speed)
        } else if (lastPlatform.getScore() < 100) {
          platform.setVelocityY(StandardPlatform.speed)
        } else if (lastPlatform.getScore() < 150) {
          platform.setVelocityY(IntermediatePlatform.speed)
        } else if (lastPlatform.getScore() < 200) {
          platform.setVelocityY(AdvancedPlatform.speed)
        } else {
          platform.setVelocityY(ExpertPlatform.speed)
        }
      }

      if (platform.getPositionY() > Game.height) {
        this.#platforms.shift()
      
        if (lastPlatform.getScore() % 50 === 49) {
          this.generateBasePlatform(lastPlatform.getScore()+1, 0)
        } else {
          const left = Math.random() * (2*Game.width/3)
          this.generatePlatform(lastPlatform.getScore()+1, left, 0)
        } 
      }
    }

    // Check collisions in next tick and act accordingly
    const finish = this.collideObject(this.#player)

    // Update elements
    this.#player.update()

    for (let platform of this.#platforms) {
      platform.update()
    }

    // Return game state
    return finish
  }

  getBackgroundColor = () => {
    return this.#backgroundColor
  }

  getPlayer = () => {
    return this.#player
  }

  getScore = () => {
    return this.#score
  }

  getPlatforms = () => {
    return this.#platforms
  }
}