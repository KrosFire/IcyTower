class Display {

  constructor(canvas, scoreTables) {
    this.buffer = document.getElementById("app").getContext("2d")
    this.context = canvas.getContext("2d")
    this.scoreTables = scoreTables
  }

  drawRectangle = (x, y, width, height, color) => {
    
    this.buffer.fillStyle = color
    this.buffer.fillRect(Math.floor(x), Math.floor(y), width, height)

  }

  fill = color => {
    this.buffer.fillStyle = color;
    this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
  }

  render = () => {
    this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
  };

  displayScore = score => {
    for (let scoreTable of this.scoreTables) {
      scoreTable.innerHTML = score
    }
  }
}