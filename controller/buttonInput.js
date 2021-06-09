class ButtonInput {
  active = false
  down = false

  getInput = down => {
    if (this.down != down) this.active = down
    this.down = down
  }
}