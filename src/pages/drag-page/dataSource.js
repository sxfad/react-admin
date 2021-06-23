import {v4 as uuid} from 'uuid';
import baseComponents from './base-components';

export async function getStores() {
    return [
        {value: 'base', label: '基础组件'},
        {value: 'module', label: '基础模块'},
        {value: 'page', label: '基础页面'},
        {value: '1', label: '自定义分类1'},
        {value: '2', label: '自定义分类2'},
    ];
}

export async function getComponents(store) {
    if (store === 'base') return baseComponents;

    return [
        {
            id: uuid(),
            title: '表单',
            children: [
                {
                    id: uuid(),
                    title: '输入框输入框输入框输入框',
                    subTitle: '输入框 Input',
                    children: [
                        {
                            id: uuid(),
                            title: '输入框',
                            image: 'https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Input.svg',
                            config: {
                                componentName: 'Input',
                                props: {
                                    placeholder: '请输入',
                                },
                            },
                        },
                        {
                            id: uuid(),
                            title: '搜索框',
                            image: 'https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Input.svg',
                            config: {
                                componentName: 'Input.Search',
                                props: {
                                    placeholder: '请搜索',
                                },
                            },
                        },
                        {
                            id: uuid(),
                            title: '文本域',
                            image: 'https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Input.svg',
                            config: {
                                componentName: 'Input.TextArea',
                                props: {
                                    placeholder: '请输入',
                                },
                            },
                        },
                    ],
                },
                {
                    id: uuid(),
                    title: '下拉框',
                    subTitle: '下拉框 Select',
                    children: [
                        {
                            id: uuid(),
                            title: '下拉框' + store,
                            image: 'https://gw.alipayobjects.com/zos/alicdn/_0XzgOis7/Select.svg',
                            config: {
                                componentName: 'Select',
                                props: {
                                    style: {width: '100%'},
                                    placeholder: '请选择',
                                    options: [
                                        {value: '1', label: '下拉项1'},
                                        {value: '2', label: '下拉项2'},
                                    ],
                                },
                            },
                        },
                    ],
                },
            ],
        },
    ];
}
