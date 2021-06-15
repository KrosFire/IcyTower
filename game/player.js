class Player {
  #color 
  #height
  #width 
  #jumping
  #velocityX
  #velocityY
  #x
  #y
  #onPlatform
  #sideBonus 
  #onBonus
  

  constructor(x=100, y=584) {
    this.#color = "#ff0000"
    this.#height = 20
    this.#width = 20
    this.#jumping = true
    this.#velocityX = 0
    this.#velocityY = 0
    this.#x = x
    this.#y = y
    this.#onPlatform = false
    this.#sideBonus = false
    this.#onBonus = false
  }

  genColor = () => { 
    return "hsl(" + 360 * Math.random() + ',' +
               (80 + 20 * Math.random()) + '%,' + 
               (50 + 10 * Math.random()) + '%)'
  }

  jump = () => {

    if(!this.#jumping) {
      this.#color = this.genColor()

      this.#velocityY -= 20 + 1.3*Math.abs(this.#velocityX)

      this.#jumping = true
      this.#sideBonus = false
    }

  }

  moveLeft = () => {
    this.#velocityX -= 2
  }

  moveRight = () => {
    this.#velocityX += 2
  }

  update = () => {
    this.#x += this.#velocityX
    this.#y += this.#velocityY

    if (Math.abs(this.#velocityX) < .05) {
      this.#velocityX = 0
    }
    if (Math.abs(this.#velocityY) < .05) {
      this.#velocityY = 0
    }
  }

  getVelocityX = () => {
    return this.#velocityX
  }

  setVelocityX = (val) => {
    this.#velocityX = val
  }

  getVelocityY = () => {
    return this.#velocityY
  }

  setVelocityY = (val) => {
    this.#velocityY = val
  }

  getWidth = () => {
    return this.#width
  }

  getPositionX = () => {
    return this.#x
  }

  setPositionX = (val) => {
    this.#x = val
  }

  getPositionY = () => {
    return this.#y
  }

  setPositionY = (val) => {
    this.#y = val
  }

  isJumping = () => {
    return this.#jumping
  }

  setJumping = (val) => {
    this.#jumping = val 
  }

  getSideBonus = () => {
    return this.#sideBonus
  }

  setSideBonus = (val) => {
    this.#sideBonus = val
  }

  isOnPlatform = () => {
    return this.#onPlatform
  }

  setOnPlatform = (val) => {
    this.#onPlatform = val
  }

  getWidth = () => {
    return this.#width
  }

  getHeight = () => {
    return this.#height
  }

  getColor = () => {
    return this.#color
  }
}