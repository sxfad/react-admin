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
 * demonstration：演示，由于左侧组件列表的显示
 * category：组件分类
 * origin：组件来源、native、antd、customer等
 * dependence：组件涉及到的依赖
 * container：是否是容器组件，容器组件内部可以添加其他组件
 * direction: vertical / horizontal 默认 vertical 子组件排列方式，默认垂直（vertical）排列
 * import：文件头部引入，用于生成源码
 * display: 用于拖拽包裹显示方式
 * defaultProps: 默认属性，用于投放到页面时的默认样式
 * props：组件的属性列表，用于右侧的属性编辑
 * */


export default {
    PageContent: {
        component: PageContent,
        demonstration: <PageContent footer={false}>页面容器</PageContent>,
        category: '布局',
        origin: 'customer',
        dependence: null,
        container: true,
        import: 'import PageContent from \'@/layouts/page-content\'',
    },
    div: {
        component: 'div',
        demonstration: <div style={{width: 60, height: 30, lineHeight: '30px', textAlign: 'center'}}>div容器</div>,
        category: '布局',
        origin: 'native', // antd customer
        dependence: null,
        container: true,
        defaultProps: {
            style: {
                minHeight: 100,
            },
        },
    },
    text: {
        component: 'text', // 文字节点
        demonstration: <span>文字</span>,
    },
    ToolBar: {
        component: ToolBar,
        category: '布局',
        origin: 'customer',
        dependence: null,
        container: true,
        direction: 'horizontal',
        import: 'import {ToolBar} from \'@/library/antd\';',
        defaultProps: {
            children: [
                {
                    __type: 'ButtonPrimary',
                    __id: uuid(),
                    type: 'primary',
                    children: [
                        {
                            __type: 'text',
                            __id: uuid(),
                            content: '工具条',
                        }
                    ],
                },
                {
                    __type: 'ButtonDanger',
                    __id: uuid(),
                    type: 'danger',
                    children: [
                        {
                            __type: 'text',
                            __id: uuid(),
                            content: '工具条',
                        }
                    ],
                },
            ],
        },
    },
    Button: {
        component: Button,
        category: '按钮',
        origin: 'antd',
        dependence: 'antd',
        import: 'import {Button} from \'antd\'',
        container: false,
        display: 'inline-block',
        defaultProps: {
            children: [
                {
                    __type: 'text',
                    __id: uuid(),
                    content: '次按钮',
                }
            ],
        },
    },
    ButtonPrimary: {
        tagName: 'Button',
        component: Button,
        category: '按钮',
        origin: 'antd',
        dependence: 'antd',
        import: 'import {Button} from \'antd\'',
        container: false,
        display: 'inline-block',
        defaultProps: {
            type: 'primary',
            children: [
                {
                    __type: 'text',
                    __id: uuid(),
                    content: '主按钮',
                }
            ],
        },
    },
    ButtonDanger: {
        tagName: 'Button',
        component: Button,
        category: '按钮',
        origin: 'antd',
        dependence: 'antd',
        import: 'import {Button} from \'antd\'',
        container: false,
        display: 'inline-block',
        defaultProps: {
            type: 'danger',
            children: [
                {
                    __type: 'text',
                    __id: uuid(),
                    content: '危险按钮',
                }
            ],
        },
    },
    Input: {
        tagName: 'Input',
        component: Input,
        category: '输入框',
        origin: 'antd',
        dependence: 'antd',
        import: 'import {Input} from \'antd\'',
        container: false,
        display: 'inline-block',
        defaultProps: {
            placeholder: '请输入',
        },
    },
};
