// 键盘事件
class Keyboard {
  constructor() {
    this.pressedLeft = false;
    this.pressedRight = false;
    this.pressedUp = false;
    this.pressedSpace = false;
    document.addEventListener('keydown',(event) => {  // 实例化后 监听事件就会执行
      this.keydown(event);
    });
    document.addEventListener('keyup', () => {
      this.keyup(event);
    });
  }

  keydown(event) {
    var key = event.keyCode;

    switch(key) {
      case 37:
        this.pressedLeft = true;
        this.pressedRight =false;
        break;
      case 38:
        this.pressedUp = true;
        break;
      case 39:
        this.pressedRight = true;
        this.pressedLeft = false;
        break;
      case 32:
        this.pressedSpace = true;
        break;
      default:
        console.log('无效的按键');
        break;
    }
    // console.log('this.pressedRight = ',this.pressedRight);
    // console.log('this.pressedLeft = ',this.pressedLeft);
    // console.log('this.pressedSpace = ',this.pressedSpace);
    // console.log('this.pressedUp = ',this.pressedUp);
    // console.log('=====================')
  };

  keyup(event) {
    var key = event.keyCode;
    switch(key) {
      case 37:
        this.pressedLeft = false;
        break;
      case 38:
        this.pressedUp = false;
        break;
      case 39:
        this.pressedRight = false;
        break;
      case 32:
        this.pressedSpace =  false;
        breck;
      default:
        console.log('无效的按键');
        break;
    }
  }

}