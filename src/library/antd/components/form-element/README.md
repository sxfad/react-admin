# 表单元素

通过配置方式，获取表单元素

## API

参数|说明|类型|默认值
---|---|---|---
type | 元素类型，可用类型有：input,hidden,number,textarea,password,mobile,email,select,select-tree,checkbox,checkbox-group,radio,radio-group,switch,date,date-range,month,time,cascader | string | 'input'
tip | 提示信息，会再label前添加问号图标 | string | -
form | from对象 | object | -
field | 表单元素字段，即form.getFieldDecorator第一个参数 | string | -  
decorator | Ant Design form.getFieldDecorator所需的第二个参数 | object | -
labelWidth | label宽度 | number 或 string | -
component | 自定义元素，如果配合Form使用，此组件请提供value onChange属性 | ReactNode 或 function | -
layout | 用于标记是否用于布局，一般用来布局提交按钮 | boolean | false  
其他 | 其他属性为Ant Design Form.Item 和表单元素提供的属性 | - | - 
