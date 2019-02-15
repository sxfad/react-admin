# 表格动画高阶组件

表格动画，能够从视觉上反馈用户的操作，合理应用动画，可以有效提高用户体验

推荐动画基于[animate.css](https://daneden.github.io/animate.css/)

## 何时使用

需要通过动画反馈表格操作的场景

## API

参数|说明|类型|默认值
---|---|---|---
rowKey | 可以确定数据唯一性的key，**由于添加删除，数据长度变化，不能使用index作为key** | string 或 function(record, index) {} | 'id'
animationDuring | 动画持续时间,单位ms| number | 500
inAnimationClass | 行入场动画class | string | 'animated fadeInLeft'
outAnimationClass | 行出场动画class | string | 'animated zoomOutRight'
