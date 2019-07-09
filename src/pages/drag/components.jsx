import React from 'react';
import {Button} from 'antd';
import PageContent from '@/layouts/page-content';

export default {
    div: {
        component: 'div',
        demonstration: <div style={{width: 100, height: 50, background: 'red'}}>div</div>,
        category: '布局',
        origin: 'native', // antd customer
        dependence: null,
        container: true,
    },
    text: {
        component: 'text', // 文字节点
        demonstration: <span>文字</span>,
    },
    PageContent: {
        component: PageContent,
        demonstration: <PageContent footer={false}>页面容器</PageContent>,
        category: '布局',
        origin: 'customer',
        dependence: null,
        container: true,
        import: 'import PageContent from \'@/layouts/page-content\'',
    },
    Button: {
        component: Button,
        category: '按钮',
        origin: 'antd',
        dependence: 'antd',
        import: 'import {Button} from \'antd\'',
        container: false,
        display: 'inline-block',
        props: [
            {
                attribute: 'children',
                name: '子组件',
                defaultValue: '次按钮',
                valueType: 'string',
            },
            {
                attribute: 'type',
                name: '类型',
                defaultValue: 'default',
                valueType: 'string',
            },
            {
                attribute: 'onClick',
                name: '点击事件',
                defaultValue: 'this.handleClick',
                valueType: 'this.function',
            },
        ],
    },
    ButtonPrimary: {
        component: Button,
        category: '按钮',
        origin: 'antd',
        dependence: 'antd',
        import: 'import {Button} from \'antd\'',
        container: false,
        display: 'inline-block',
        props: [
            {
                attribute: 'children',
                name: '子组件',
                defaultValue: '主按钮',
                valueType: 'string',
            },
            {
                attribute: 'type',
                name: '类型',
                defaultValue: 'primary',
                valueType: 'string',
            },
            {
                attribute: 'onClick',
                name: '点击事件',
                defaultValue: 'this.handleClick',
                valueType: 'this.function',
            },
        ],
    },
};
