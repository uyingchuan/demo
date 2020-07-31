## 案例：瀑布流布局实现

### 瀑布流

瀑布流，又称瀑布流式布局。是比较流行的一种网站页面布局，视觉表现为参差不齐的多栏布局，随着页面滚动条向下滚动，这种布局还会不断加载数据块并附加至当前尾部。最早采用此布局的网站是 Pinterest，逐渐在国内流行开来。国内大多数清新站基本为这类风格。

### 瀑布流的原理

利用绝对定位，设置图片等宽按列排放

#### 相关操作

1. 图片的排列：计算当前页面放多少列图片合适，绝对定位图片的位置，用一个数组将每列的图片总宽度记录下来，每次要加载新图片时放在总宽度数组中值最小的那一列，然后更新数组。具体代码如下：

```javaScript
    // 实现图片的绝对定位
      function waterfall() {
        const oMain = document.getElementById("main");
        // 获取当前页面所有 .box 盒子
        const boxArr = [...oMain.getElementsByClassName("box")];

        // 设定 #main .box 盒子的样式
        // 1.获取当个 .box 盒子的 width
        const boxWidth = boxArr[0].offsetWidth;
        // 2.计算当前页面窗口宽度多少列图片合适
        const column = Math.floor(getClient().width / boxWidth - 1);
        // 3.给盒子父元素 #main 加宽度样式并居中
        oMain.style.cssText = "width:" + boxWidth * column + "px;margin:0 auto";

        // 记录每列盒子的 offsetHeight 之和
        const offsetHeightArr = [];
        // 给每个 .box 盒子定位
        for (let i = 0; i < boxArr.length; i++) {
          // 第一行记录 offsetHeight，定位上有点不同
          if (i < column) {
            boxArr[i].style.position = "absolute";
            boxArr[i].style.top = 0;
            boxArr[i].style.left = i * boxWidth + "px";
            offsetHeightArr.push(boxArr[i].offsetHeight);
          } else {
            // 计算当前 offsetHeightArr 数组中值最小的那一列
            const index = offsetHeightArr.indexOf(
              Math.min.apply(null, offsetHeightArr)
            );
            // 给盒子定位
            boxArr[i].style.position = "absolute";
            boxArr[i].style.top = offsetHeightArr[index] + "px";
            boxArr[i].style.left = boxArr[index].offsetLeft + "px";
            // 更新添加 .box 盒子的那一列 offsetHeight 的和
            offsetHeightArr[index] += boxArr[i].offsetHeight;
          }
        }
      }
```

2. 图片加载功能：利用`window.onscroll`事件判定是否需要加载新的图片，通过最后一张图片的高度中线与可视窗口的底边位置关系进行判断。具体代码如下：

```JavaScript
    // 页面滚动加载图片
      window.onscroll = function () {
        if (isFlow()) {
        for (let i = 0; i < imagesSrc.length; i++) {
            oMain.appendChild(createBox(imagesSrc[i]));
            waterfall();
            }
        }
      };
    // 判定是否继续生成新图片(判断最后一张图片的中线是否超过视图窗口底线)
      function isFlow() {
        const oMain = document.getElementById("main");
        const boxArr = [...oMain.getElementsByClassName("box")];

        // 最后一张图片的 offsetTop 加上高度的一半
        const lastBoxHeight =
          boxArr[boxArr.length - 1].offsetTop +
          Math.floor(boxArr[boxArr.length - 1].offsetHeight / 2);

        return lastBoxHeight < getScroll().top + getClient().height
          ? true
          : false;
      }
```

### 相关知识点
1. 兼容问题：针对跨浏览器可能出现的兼容性问题，将获取页面的可视尺寸与滚动尺寸代码进行修改。如下：
``` JavaScript
    // 获取当前 可视窗口区域 的 clientWidth 和 clientHeight（兼容）
      function getClient() {
        return {
          width:
            window.innerWidth ||
            document.body.clientWidth ||
            document.documentElement.clientWidth,
          height:
            window.innerHeight ||
            document.body.clientHeight ||
            document.documentElement.clientHeight,
        };
      }

    // 获取当前文档的滚动 top 方向的距离（兼容）
      function getScroll() {
        return {
          top: document.body.scrollTop || document.documentElement.scrollTop,
        };
      }
```
