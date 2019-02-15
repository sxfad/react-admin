# 表单布局

基于antd FormItem进行布局，label固定宽度，表单元素自适应

## API

参数|说明|类型|默认值
---|---|---|---
className | 添加在FormItem父级div上的class | string | - 
style | 添加在FormItem父级div上的style | object | - 
width | FormItem父级div的总宽度 label + element | string 或 number | - 
float | 是否是浮动，如果true，将左浮动 | bool | false 
label | 标签 | any | -
labelWidth | label宽度，如果设置此值，labelSpaceCount 和 labelFontSize将失效 | number | -
labelSpaceCount | label所占空间个数，用于与其他label对齐 | number | -
labelFontSize | label字体大小，最终labelWidth = labelSpaceCount * labelFontSize | number | -
tip | 表单元素后面的提示 | any | -
tipWidth | 提示的宽度 | number | -
tipColor | 提示颜色 | string | - 

