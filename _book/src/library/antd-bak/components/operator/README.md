# 操作

## 何时使用
一般用于列表最后的操作列

## API

参数|说明|类型|默认值
---|---|---|---
items | 每一项的配置 | array | -
moreContentWidth | 更多弹出面板宽度 | string 或 number | 'auto'
moreTrigger | 更多触发方式 | string 或 array | 'click'
moreText | 更多文本 | any | `<span>更多<Icon type="down"/></span>`

### items项

参数|说明|类型|默认值
---|---|---|---
label | 显示的文本 | any | -
visible | 是否可见 | bool | true
disabled | 是否禁用 | bool | false
color | label颜色 | string | -
loading | 是否加载中 | bool | false
isMore | 是否是更多选项 | bool | false
onClick | 点击事件 | function() {} | -
confirm | 气泡确认框，一般用于删除提示等，如果存在此选项，将是确认框形式，参见 [Popconfirm](http://ant-design.gitee.io/components/popconfirm-cn/)配置 | object | -
withKey | 气泡确认框模式下，是否配合 command alt ctrl键，不弹出提示 | bool | true
prompt | 弹框输入，如果存在此项，将是弹框输入参见 [Prompt](/example/prompt)配置 | object | -
statusSwitch | 状态切换配置，如果存在此项，将是状态切换按钮 | object | -

