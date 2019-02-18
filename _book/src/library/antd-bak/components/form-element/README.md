# 表单元素

通过配置方式，获取表单元素

## API

参数|说明|类型|默认值
---|---|---|---
type | 元素类型，可用类型有：input,hidden,number,textarea,password,mobile,email,select,select-tree,checkbox,checkbox-group,radio,radio-group,switch,date,date-range,month,time,cascader | string | 'input'
component | 自定义元素，如果配合Form使用，此组件请提供value onChange属性 | ReactNode 或 function | - 
其他 | 其他属性为Ant Design Form.Item 和表单元素提供的属性 | - | - 
