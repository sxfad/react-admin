import React from 'react';
import DemoPage from '@/library/antd/demo-page';
import * as Base from '@/library/antd/components/tool-bar/demo/Base';
import config from '@/commons/config-hoc';

const demos = [
    {
        component: Base.default,
        title: Base.title,
        markdown: Base.markdown,
        code: `
import React, {Component} from 'react';
import {ToolBar} from '../sx-antd';

export default class Base extends Component {
    render() {
        return (
            <ToolBar
                items={[
                    {key: 'add', text: '添加', icon: 'plus', onClick: () => console.log('添加')},
                    {key: 'delete', text: '删除', type: 'danger', icon: 'delete', onClick: () => console.log('删除')},
                    {key: 'export', text: '导出', type: 'default', icon: 'export', disabled: true, onClick: () => console.log('导出')},
                    {key: 'detail', component: <a onClick={() => console.log('详情')}>详情</a>},
                    {key: 'get', component: () => <a onClick={() => console.log('获取组件')}>获取组件</a>},
                ]}
            />
        );
    }
}


        `,
    },
];
const readme = `# 工具条
通过配置的方式，创建工具条组件

## 何时使用
通过配置方式，编写工具条场景下使用

`;
const api = `## API


参数|说明|类型|默认值
---|---|---|---
items | 工具项配置 | array | -

### 每一项API

参数|说明|类型|默认值
---|---|---|---
key | react 列表循环需要的key | string | index
type | 按钮的type | string| 'primary'
icon | 按钮的icon | Icon | -
text | 按钮的text | any | -
visible | 此项是否可见 | bool | true
disabled | 按钮的disabled 属性 | bool | false
onClick | 按钮点击回调 | function | -
component | 非按钮时，自定义组件 | ReactNode 或 function | -

注：其他属性将全部传递给\`Button\`组件

`;

@config({
    path: '/example/antd/tool-bar',
})
export default class extends React.Component {
    render() {
        return <DemoPage demos={demos} readme={readme} api={api}/>;
    }
};
