# 弹框输入

## API

参数|说明|类型|默认值
---|---|---|---
visible | 是否显示 | bool | false
defaultVisible | 默认是否显示 | bool | true
title | 提示信息 | any | '请输入'
okText | 确认按钮文本 | string | '确认'
cancelText | 取消按钮文本 | string | '取消'
onClickLabel | label点击触发，一般通过visible控制显示隐藏时才会用到 | function() {} | -
onConfirm | 确认回调 | function(values) {} | -
onCancel | 取消回调 | function() {} | -
onVisibleChange | visible改变回调 | function(visible) {} | -
inputProps | 内置input 元素属性 | object | -
items | 自定义表单元素，参见[getFormItem](/example/form-util) | array | `[]`