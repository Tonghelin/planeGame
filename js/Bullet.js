class Bullet extends Element {
  constructor(opts) {
    super(opts);
  }

  draw() {
    // throw new Error('You should implement draw function');
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#fff";
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x, this.y - this.size);
    this.ctx.closePath();
    this.ctx.stroke();
    return this;
  }

  fly() {
    this.move(0, -this.size);
  }

  hasHit(enemy) {
    return this.x > enemy.x && this.x < enemy.x + enemy.size
      && this.y > enemy.y && this.y < enemy.y + enemy.size
  }

}