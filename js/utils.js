// 工具类

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000/30);
  };

/**
 * 资源加载
 * @param {Array} resources 资源列表
 * */

function resourceOnload(resources, callback) {
  var total = resources.length;
  var finish = 0;
  var images = [];
  for (var i = 0; i < total; i++){
    images[i] = new Image();
    images[i].src = resources[i];
    // 图片加载完成
    images[i].onload = function() {
      // 加载完成
      finish++;
      if (finish == total) {
        // 全部加载完成
        callback(images);
      }
    }
  }
}

/**
 * @param  null
 * 获取目标对象实例中最小的横坐标和最大的横坐标
 * */
function getHorizontalBundary(arrs) {
  var minX, maxX;
  arrs.forEach((item) => {
    if (!minX && !maxX ) {
      minX = item.x;
      maxX = item.x;
    } else {
      if (item.x < minX) {
        minX = item.x;
      }
      if (item.x > maxX) {
        maxX = item.x;
      }
    }
  });

  return {
    minX: minX,
    maxX: maxX,
  }
}
