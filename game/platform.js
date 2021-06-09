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