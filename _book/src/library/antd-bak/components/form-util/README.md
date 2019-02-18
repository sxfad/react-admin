# 表单相关工具

通过配置方式，获取表单元素等

## API

### getFormElement(options)

> 基于配置，获取表单元素

options参数为对象，具体属性说明如下：

参数|说明|类型|默认值
---|---|---|---
type | 元素类型，可用类型有：input,number,textarea,password,mobile,email,select,select-tree,checkbox,checkbox-group,radio,radio-group,switch,date,date-range,month,time,cascader | string | 'input'
placeholder | 元素的placeholder属性 | string | '请输入{label}' 或 '请选择{label}' 
elementProps | 元素属性，会直接添加到元素上，比如Input上的属性等，但不会应用到自定义组件 component 上 | object | -
elementProps.options | 数组，形式为：`[{label: xxx, value: xxx}, ...]`，select,select-tree等组件，通过options提供选项 | array | -
component | 自定义元素，如果配合Form使用，此组件请提供value onChange属性 | any | - 


### getFormItem(options, form)

将返回如下结构
```jsx
    <FormItemLayout key={item.field} {...item}>
        {getFieldDecorator(field, decorator)(getFormElement(item))}
    </FormItemLayout>
```

参数说明：

参数|说明|类型|默认值
---|---|---|---
options | 为 [FontItemLayout](/example/form-item-layout) 属性 和 getFormElement 所需属性结合，比如 type label field 等 | object | -
from | 为 antd 的 form | object | -
