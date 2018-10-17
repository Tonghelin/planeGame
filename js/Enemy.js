const ENEMY_DIR = {
  LEFT: 'left',
  RIGHT: 'right'
}

const ENEMY_STATUS = {
  ALIVE: 'alive',
  BOOMING: 'booming',
  DEAD: 'dead'
}

class Enemy extends Element {
  constructor(opts) {
    super(opts);
    this.icon = opts.icon;
    this.iconBoomed = opts.iconBoomed;
    this.status = ENEMY_STATUS.ALIVE;
  }

  swing(direct = ENEMY_DIR.LEFT) {
    const detaX = direct == ENEMY_DIR.LEFT? -this.speed : this.speed;
    return this.move(detaX, 0);
  }

  draw() {
    const icon = this.status == ENEMY_STATUS.ALIVE?this.icon:this.iconBoomed;
    this.ctx.drawImage( icon, this.x, this.y, this.size, this.size); // this.x,this.y,this.size 父类继承而来
    return this; // 方便链式调用
  }

  down(){
    // this.y = this.y + this.size;
    return this.move(0, this.size)
  }
  boom() {
    this.boomCount = this.boomCount? this.boomCount + 1: 1;
    this.status = ENEMY_STATUS.BOOMING;
    if (this.boomCount >3 ) {
      this.status = ENEMY_STATUS.DEAD;
    }
  }

}