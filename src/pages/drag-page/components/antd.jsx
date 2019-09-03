import {
    Button,
    Row,
    Col,
    Tabs,
    Icon,
} from 'antd';
import uuid from "uuid/v4";

export const category = 'Ant Design 组件库';
export const icon = 'ant-design';

export default {
    Button: {
        tagName: 'Button',
        component: Button,
        title: '按钮',
        dependence: 'antd',
        container: false,
        display: 'inline-block',
        description: '普通按钮',
        defaultProps: {
            type: 'primary',
            children: [
                {
                    __type: 'text',
                    __id: uuid(),
                    content: '按钮',
                }
            ],
        },
        props: [
            {
                name: '类型',
                attribute: 'type',
                valueType: 'string',
                defaultValue: 'default', // 如果与defaultValue相同，则不需要在组件上添加这个属性
                formType: 'select',
                // formType: 'hidden',
                options: [
                    {value: 'primary', label: '主要按钮'},
                    {value: 'default', label: '次要按钮'},
                    {value: 'dashed', label: '虚线按钮'},
                    {value: 'danger', label: '危险按钮'},
                ],
            },
            {
                name: '图标',
                attribute: 'icon',
                valueType: 'string',
                formType: 'icon-picker',
            },
            {
                name: '禁用',
                attribute: 'disabled',
                valueType: 'boolean',
                defaultValue: false,
                formType: 'switch',
                checkedChildren: '是',
                unCheckedChildren: '否',
            },
            {
                name: '幽灵',
                attribute: 'ghost',
                valueType: 'boolean',
                defaultValue: false,
                formType: 'switch',
                checkedChildren: '是',
                unCheckedChildren: '否',
            },
            {
                name: '形状',
                attribute: 'shape',
                valueType: 'string',
                defaultValue: 'default',
                formType: 'select',
                options: [
                    {value: 'default', label: '默认'},
                    {value: 'circle', label: '原形'},
                ],
            },
            {
                name: '大小',
                attribute: 'size',
                valueType: 'string',
                defaultValue: 'default',
                formType: 'select',
                options: [
                    {value: 'default', label: '默认'},
                    {value: 'small', label: '小按钮'},
                    {value: 'large', label: '大按钮'},
                ],
            },
            // {
            //     name: '单击事件',
            //     attribute: 'onClick',
            //     valueType: 'string',
            //     formType: 'input',
            // },
        ],
    },
    Icon: {
        component: Icon,
        title: '图标',
        dependence: 'antd',
        container: false,
        display: 'inline-block',
        description: '图标',
        defaultProps: {
            type: 'user',
        },
        props: [
            {
                name: '类型',
                attribute: 'type',
                valueType: 'string',
                defaultValue: 'default', // 如果与defaultValue相同，则不需要在组件上添加这个属性
                formType: 'select',
                // formType: 'hidden',
                options: [
                    {value: 'primary', label: '主要按钮'},
                    {value: 'default', label: '次要按钮'},
                    {value: 'dashed', label: '虚线按钮'},
                    {value: 'danger', label: '危险按钮'},
                ],
            },
        ],
    },
    Row: {
        component: Row,
        title: '栅格行',
        dependence: 'antd',
        container: true,
        acceptTypes: 'Col',
        direction: 'horizontal',
    },
    Col: {
        component: Col,
        title: '栅格列',
        dependence: 'antd',
        container: true,
        innerWrapper: true,
        targetTypes: ['Row', 'RowCol1x2', 'RowCol1x3'],
        description: '栅格系统说明啊',
        defaultProps: {
            span: 12,
        },
        props: [
            {
                name: '格数',
                attribute: 'span',
                valueType: 'number',
                defaultValue: 24,
                formType: 'select',
                options: [
                    {value: 1, label: 1},
                    {value: 2, label: 2},
                    {value: 3, label: 3},
                    {value: 4, label: 4},
                    {value: 5, label: 5},
                    {value: 6, label: 6},
                    {value: 7, label: 7},
                    {value: 8, label: 8},
                    {value: 9, label: 9},
                    {value: 10, label: 10},
                    {value: 11, label: 11},
                    {value: 12, label: 12},
                    {value: 13, label: 13},
                    {value: 14, label: 14},
                    {value: 15, label: 15},
                    {value: 16, label: 16},
                    {value: 17, label: 17},
                    {value: 18, label: 18},
                    {value: 19, label: 19},
                    {value: 20, label: 20},
                    {value: 21, label: 21},
                    {value: 22, label: 22},
                    {value: 23, label: 23},
                    {value: 24, label: 24},
                ],
            },
        ],
    },
    RowCol1x2: {
        component: Row,
        title: '栅格1x2',
        dependence: 'antd',
        container: true,
        acceptTypes: 'Col',
        direction: 'horizontal',
        defaultProps: {
            children: [
                {
                    __type: 'Col',
                    __id: uuid(),
                    span: 12,
                },
                {
                    __type: 'Col',
                    __id: uuid(),
                    span: 12,
                }
            ],
        }
    },
    RowCol1x3: {
        component: Row,
        title: '栅格1x3',
        dependence: 'antd',
        container: true,
        acceptTypes: 'Col',
        direction: 'horizontal',
        defaultProps: {
            children: [
                {
                    __type: 'Col',
                    __id: uuid(),
                    span: 8,
                },
                {
                    __type: 'Col',
                    __id: uuid(),
                    span: 8,
                },
                {
                    __type: 'Col',
                    __id: uuid(),
                    span: 8,
                }
            ],
        }
    },
    Tabs: {
        component: Tabs,
        title: '标签容器',
        dependence: 'antd',
        container: true,
        acceptTypes: 'Tabs.TabPane',
        description: '标签页容器，只能接受TabPane作为直接子节点。',
        defaultProps: {
            type: 'card',
            children: [
                {
                    __type: 'Tabs.TabPane',
                    __id: uuid(),
                    tab: '标签1',
                    key: '1',
                },
                {
                    __type: 'Tabs.TabPane',
                    __id: uuid(),
                    tab: '标签2',
                    key: '2',
                },
            ],
        },
        props: [
            {
                name: '标签样式',
                attribute: 'type',
                valueType: 'string',
                defaultValue: 'line',
                formType: 'select',
                options: [
                    {value: 'line', label: '线条'},
                    {value: 'card', label: '卡片'},
                ],
            },
        ],
    },
    'Tabs.TabPane': {
        component: Tabs.TabPane,
        title: '标签页',
        dependence: 'antd',
        container: true,
        innerWrapper: true,
        targetTypes: 'Tabs', // 可投放容器
        description: '标签页面板，只能放在标签容器组件中。',
        defaultProps: {
            tab: '标签名'
        },
        props: [
            {
                name: '标签名',
                attribute: 'tab',
                valueType: 'string',
            },
        ],
    },
};
