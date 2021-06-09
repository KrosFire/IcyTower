class Engine {

  constructor(timeStep, update, render) {
    this.accTime = 0
    this.animationFrameReq = undefined
    this.time = undefined
    this.timeStep = timeStep

    this.update = update
    this.render = render

    this.finished = false
  }

  run = timeStamp => {
    this.accTime += timeStamp - this.time
    this.time = timeStamp

    /* Since we can only update when the screen is ready to draw and requestAnimationFrame
    calls the run function, we need to keep track of how much time has passed. We
    store that accumulated time and test to see if enough has passed to justify
    an update. Remember, we want to update every time we have accumulated one time step's
    worth of time, and if multiple time steps have accumulated, we must update one
    time for each of them to stay up to speed. */
    if (this.accTime >= this.timeStep*3) {
      this.accTime = this.timeStep
    }

    while(this.accTime >= this.timeStep) {
      this.accTime -= this.timeStep;

      this.update(this.timeStep);

      this.updated = true;// If the game has updated, we need to draw it again.

    }

    /* This allows us to only draw when the game has updated. */
    if (this.updated) {

      this.updated = false;
      this.render(timeStamp);

    }

    if(!this.finished) {
      this.animationFrameReq = window.requestAnimationFrame(this.run);
    }
  }

  start = () => {
    this.finished = false
    this.accTime = this.timeStep
    this.time = window.performance.now()
    this.animationFrameReq = window.requestAnimationFrame(this.run)
  }

  stop = () => {
    window.cancelAnimationFrame(this.animationFrameReq)
    this.finished = true
  }

  resume = () => {
    this.finished = false
    this.time = window.performance.now()
    this.animationFrameReq = window.requestAnimationFrame(this.run)
  }
}