# 弹框页面开发
添加、修改等场景，往往会用到弹框，antd Modal组件使用不当会产生脏数据问题（两次弹框渲染数据互相干扰）

系统提供了基于modal封装的高阶组件，每次弹框关闭，都会销毁弹框内容，避免互相干扰


## modal高阶组件
modal高阶组件集成到了config中，也可以单独引用：`import {modal} from 'src/library/components';`

```jsx
import React from 'react';
import config from 'src/commons/config-hoc';
import {ModalContent} from 'src/library/components';

export default config({
    modal: {
        title: '弹框标题',
    },
})(props => {
    const {onOk, onCancel} = props;

    return (
        <ModalContent
            onOk={onOk}
            onCancel={onCancel}
        >
            弹框内容
        </ModalContent>
    );
});
```

modal所有参数说明如下：

1. 如果是string，作为modal的title
1. 如果是函数，函数返回值作为 Modal参数
1. 如果是对象，为Modal相关配置，具体参考 [antd Modal组件](https://ant-design.gitee.io/components/modal-cn/#API)
1. options.fullScreen boolean 默认false，是否全屏显示弹框

## ModalContent
弹框内容通过 ModalContent包裹，具体参数如下：
            
参数|类型|默认值|说明
---|---|---|---
surplusSpace|boolean|false|是否使用屏幕垂直方向剩余空间 
otherHeight|number|-|除了主体内容之外的其他高度，用于计算主体高度；
loading|boolean|false|加载中
loadingTip|-|-|加载提示文案
footer|-|-|底部
okText|string|-|确定按钮文案
onOk|function|-|确定按钮事件
cancelText|string|-|取消按钮文案
onCancel|function|-|取消按钮事件
resetText|string|-|重置按钮文案
onReset|function|-|重置按钮事件
style|object|-|最外层容器样式
bodyStyle|object|-|内容容器样式
