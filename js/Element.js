class Element {
  constructor( opts = {} ) {
    this.x = opts.x;
    this.y = opts.y;
    this.size = opts.size;
    this.speed = opts.speed;
    this.ctx = opts.ctx;
  }

  move(detaX, detaY) {
    this.x += detaX;
    this.y += detaY;
    return this;
  }

  draw() {
    throw new Error('You should implement draw function');
  }
}