import React from 'react';
import {Button, Input} from 'antd';
import PageContent from '@/layouts/page-content';
import {ToolBar} from '@/library/antd';
import uuid from "uuid/v4";

/**
 * 系统可用组件配置文件
 * 结构为对象，key对应组件type
 * tagName: 标签名，一般用于生成源码，缺省取key作为tagName
 * parentTagName: 父级标签名，用于做投放限制
 * component：组件，用于渲染，一般与key同名
 * category：组件分类
 * origin：组件来源、native、antd、customer等
 * dependence：组件涉及到的依赖
 * container：是否是容器组件，容器组件内部可以添加其他组件
 * direction: vertical / horizontal 默认 vertical 子组件排列方式，默认垂直（vertical）排列
 * import：文件头部引入，用于生成源码
 * display: 用于拖拽包裹显示方式
 * visible: 是否在组件列表中显示
 * defaultProps: 默认属性，用于投放到页面时的默认样式
 * props：组件的属性列表，用于右侧的属性编辑
 * */


export default {
    text: {
        component: 'text', // 文字节点
        visible: false,
        defaultProps: {
            content: '纯文本',
        },
        render: props => props.content,
    },
    tip: {
        component: 'div',
        defaultProps: {
            children: [
                {
                    __type: 'text',
                    __id: uuid(),
                    content: '文字说明（TODO）',
                }
            ],
        },
    },
    span: {
        component: 'span',
        category: '布局',
        origin: 'native',
        display: 'inline-block', // 如果使用inline，布局会有些问题，这里使用inline-block
        defaultProps: {
            children: [
                {
                    __type: 'text',
                    __id: uuid(),
                    content: '行内元素（span）',
                }
            ],
        },
    },
    div: {
        component: 'div',
        category: '布局',
        origin: 'native', // antd customer
        container: true,
        defaultProps: {
            style: {
                minHeight: 30,
                minWidth: 50,
            },
            children: [
                {
                    __type: 'text',
                    __id: uuid(),
                    content: '块级元素（div）',
                }
            ],
        },
        render: props => <div {...props}>{props.children}</div>
    },
    divInline: {
        component: 'div',
        category: '布局',
        origin: 'native', // antd customer
        container: true,
        display: 'inline-block',
        defaultProps: {
            style: {
                display: 'inline-block',
                minHeight: 30,
                minWidth: 50,
            },
            children: [
                {
                    __type: 'text',
                    __id: uuid(),
                    content: '行内块级元素（div）',
                }
            ],
        },
        render: props => <div {...props}>{props.children}</div>
    },
};
