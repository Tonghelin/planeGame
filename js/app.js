// 元素
var container = document.getElementById('game');
const canvas = document.getElementById('canvas');
const canvasHeight = canvas.clientHeight;
const canvasWidth = canvas.clientWidth;
const context = canvas.getContext('2d');

const DEFAULT_OPT = {
  status: 'start', // 游戏开始默认为开始中
  level: 1, // 游戏默认等级
  totalLevel: 6, // 总共6关
  numPerLine: 6, // 游戏默认每行多少个怪兽
  canvasPadding: 30, // 默认画布的间隔
  bulletSize: 10, // 默认子弹长度
  bulletSpeed: 10, // 默认子弹的移动速度
  enemySpeed: 2, // 默认敌人移动距离
  enemySize: 50, // 默认敌人的尺寸
  enemyGap: 10,  // 默认敌人之间的间距
  enemyIcon: './img/enemy.png', // 怪兽的图像
  enemyBoomIcon: './img/boom.png', // 怪兽死亡的图像
  enemyDirection: 'right', // 默认敌人一开始往右移动
  planeSpeed: 5, // 默认飞机每一步移动的距离
  planeSize: {
    width: 60,
    height: 100
  }, // 默认飞机的尺寸,
  planeIcon: './img/plane.png',
}

/**
 * 整个游戏对象
 */

var GAME = {
  /**
   * 初始化函数,这个函数只执行一次
   * @param  {object} opts 
   * @return {[type]}      [description]
   */
  init: function(opt) {
    this.status = 'start';

    // 初始化配置
    const opts = Object.assign({},DEFAULT_OPT, opt);  // Object.assign(); ES6拷贝数据...用于对象的合并，将源对象（ source ）的所有可枚举属性，复制到目标对象（ target ）第一个参数是目标对象，后面的参数都是源对象。
    opts.planePosX = ( canvasWidth - opts.planeSize.width ) / 2;
    opts.planePosY = canvasHeight - opts.planeSize.height;

    const imgUrls = [
      opts.enemyIcon,
      opts.enemyBoomIcon,
      opts.planeIcon
    ];

    this.keyboard = new Keyboard();

    resourceOnload(imgUrls, (imgs) => {
      opts.enemyIcon = imgs[0];
      opts.enemyBoomIcon = imgs[1];
      opts.planeIcon = imgs[2];
    });
    this.opts = opts;
    this.bindEvent();
  },
  bindEvent: function() {
    var self = this;
    var playBtn = document.querySelector('.js-play');
    // 开始游戏按钮绑定
    playBtn.onclick = function() {
      self.play();
    };
  },
  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通过
   * stop 游戏暂停（可选）
   */
  setStatus: function(status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },
  play: function() {
    this.setStatus('playing');
    const { opts } = this;
    const {
      enemyIcon,
      enemyBoomIcon,
      enemySize,
      enemySpeed,
      numPerLine,
      level,
      enemyGap,
      canvasPadding,
      planeSpeed,
      bulletSize,
      bulletSpeed
    } = opts;

    this.enemys = []; // 怪物列表
    for (let i = 0; i < level ; i++) {
      for (let j = 0; j < numPerLine; j++) {
        this.enemys.push(new Enemy({
          ctx: context,
          x: (enemyGap + enemySize) * j + canvasPadding,
          y: (enemyGap + enemySize) * i + canvasPadding,
          size: enemySize,
          icon: enemyIcon,
          speed: enemySpeed,
          iconBoomed: enemyBoomIcon,
          status: 'alive'
        }));
      }
    }

    // 开始监听用户输入
    // this.beginListenUserInput();
    this.plane = new Plane({ // 创建飞机实例
      ctx: context,
      x: opts.planePosX,
      y: opts.planePosY,
      planeIcon: opts.planeIcon,
      width: opts.planeSize.width,
      height: opts.planeSize.height,
      speed: planeSpeed,
      bulletSize: bulletSize,
      bulletSpeed: bulletSpeed
    });
    //
    this.update();
  },
  // 根据新的游戏数据，刷新游戏画面
  update: function() {
    let self = this;
    // 清空画布
    this.clear();

    // 怪物自动移动
    this.updateEnemy();
    // 用户输入导致飞机移动或者子弹发射
    this.updatePlane();

    // 判断游戏结束条件
    if(!this.enemys.length){
      // 游戏成功
      this.end('success');
    } else if (0){
      this.end('fail');
    } else {
      // 根据游戏数据绘制游戏画面
      this.draw();

      // setTimeout(() => {
      //   this.update();
      // },1000/60);
      requestAnimationFrame(function() {  // 工具类中实现兼容
        self.update();
      })
    }

  },
  clear: function() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
  },
  end: function() {
    // 清空画布
    // 切换游戏菜单
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    console.log('游戏结束');

  },
  draw: function(){
    // 绘制飞机
    this.plane.draw();
    // 绘制怪兽
    this.enemys.forEach((enemy) => {
      enemy.draw();
    });
  },
  updateEnemy: function() {
    // 碰边检测
    const { opts } = this;
    const { canvasPadding, enemySize, enemyDirection } = opts;
    let isBoundary = false;

    const {minX, maxX} = getHorizontalBundary(this.enemys);
    if (minX < canvasPadding || maxX > canvasWidth - canvasPadding - enemySize) {
      opts.enemyDirection = enemyDirection === ENEMY_DIR.RIGHT?ENEMY_DIR.LEFT:ENEMY_DIR.RIGHT;
      isBoundary = true;
    }
    this.enemys = this.enemys.map((enemy) => {
      enemy.swing(opts.enemyDirection);
      if (isBoundary) {
        enemy.down();
      }
      switch (enemy.status) {
        case ENEMY_STATUS.ALIVE:
          if (this.plane.hasHit(enemy)) {
            enemy.boom();
          }
          break;
        case ENEMY_STATUS.BOOMING:
          enemy.boom();
          break;
        case ENEMY_STATUS.DEAD: // 死亡，移除数组
          enemy.__readyToDead = true;
          break;
      }
      return enemy;
    }).filter((enemy) => {
      return !enemy.__readyToDead;
    })
  },
  updatePlane: function() {
    const { pressedLeft, pressedRight, pressedUp, pressedSpace } = this.keyboard;

    if (pressedLeft && !pressedRight) {
      this.plane.swing(PLANE_DIR.LEFT);
    } else if (pressedRight && !pressedLeft) {
      this.plane.swing(PLANE_DIR.RIGHT);
    }
    if( pressedSpace || pressedUp) {
      this.plane.shoot();
    }
  }
};


// 初始化
GAME.init();
