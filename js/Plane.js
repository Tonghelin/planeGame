//常量配置
const PLANE_DIR = {
  LEFT: 'left',
  RIGHT: 'right'
}

class Plane extends Element {
  constructor(opts) {
    super(opts);
    this.width = opts.width;
    this.height = opts.height;
    this.icon = opts.planeIcon;
    this.bullets = [];
    this.bulletSize = opts.bulletSize;
    this.bulletSpeed = opts.bulletSpeed;
    this.overheated = false;
  }

  draw() {
    // throw new Error('You should implement draw function');
    this.ctx.drawImage(this.icon, this.x, this.y, this.width, this.height);
    // 绘制子弹
    this.bullets.forEach((bullet) => {
      bullet.fly();
      bullet.draw();
    })
    return this;
  }

  hasHit(enemy) {
    const idx = this.bullets.findIndex((bullet) => {
      return bullet.hasHit(enemy);
    })
    
    if (idx > -1) {
      this.bullets.splice(idx, 1);
      return true;
    }

    return false;
  }

  swing(direct) {
    switch(direct) {
      case 'left':
        this.move(-this.speed, 0);
        break;
      case 'right':
        this.move(this.speed, 0);
        break;
      default:
        console.log('fly')
        break;
    }
  }

  shoot() { // 生成子弹，但不绘制
    if (this.overheated) { // 控制子弹
      return;
    }
    this.overheated = true;

    this.bullets.push(new Bullet({
      ctx: this.ctx,
      x: this.x + this.width / 2,
      y: this.y,
      size: this.bulletSize,
      speed: this.bulletSpeed
    }));
    // 创建子弹
    setTimeout(() => {
      this.overheated = false;
    }, 150);
  }
}