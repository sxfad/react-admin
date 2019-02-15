# 查询条件
通过配置的方式，获取查询条件

## 何时使用
一般用于简单的列表页查询条件，通过配置，快速编写查询条件，太复杂的查询条件可能不适合；

## API

参数|说明|类型|默认值
---|---|---|---
showSubmit | 是否显示提交按钮 | bool | true
submitText | 提交按钮文案 | ReactNode 或 string | '查询'
showReset | 是否显示重置按钮 | bool | true
resetText | 重置按钮文案 | ReactNode 或 string | '重置'
collapsed | 是否收起 | bool | false
items | 查询条件没一项配置 | object | -
onSubmit | 提交时触发（回车或则点击查询按钮）| function(values) {} | -
formRef | 获取内部form | function(form) {} | -
loadOptions | 获取下拉、下拉树等数据，一个返回object 或 Promise，数据以field作为key对应 | (form) => Promise | -
extra | 查询、重置按钮组中额外内容 | ReactNode 或 string | -
buttonContainerStyle | 查询、重置按钮组样式 | object | -

### items
参数|说明|类型|默认值
---|---|---|---
collapsedShow | 是否在收起时显示| bool | false
itemStyle | 最外层容器样式 | object | -
其他 | FormElement所需参数，[点击这里](/example/form-element/README.md) | - | -


