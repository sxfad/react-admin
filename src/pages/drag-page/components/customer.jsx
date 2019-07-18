import PageContent from '@/layouts/page-content';
import {ToolBar, QueryBar} from '@/library/antd';
import uuid from "uuid/v4";

export const category = '自定义组件';

export default {
    PageContent: {
        component: PageContent,
        title: '页面容器',
        container: true,
        visible: false,
        import: 'import PageContent from \'@/layouts/page-content\'',
        description: '页面统一容器。',
        defaultProps: {
            children: [
                {
                    __type: 'div',
                    __id: uuid(),
                    children: [
                        {
                            __type: 'text',
                            __id: uuid(),
                            content: '页面容器',
                        }
                    ],
                }
            ],
        },
    },
    ToolBar: {
        component: ToolBar,
        title: '工具条',
        container: true,
        direction: 'horizontal',
        dependence: '@/library/antd',
        description: '工具容器，一般内部是一些按钮。',
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
    QueryBar: {
        component: QueryBar,
        title: '查询条件',
        container: true,
        direction: 'horizontal',
        dependence: '@/library/antd',
        description: '用于包裹一些查询条件的容器。',
        defaultProps: {
            children: [
                {
                    __type: 'FormRow',
                    __id: uuid(),
                    children: [
                        {
                            __type: 'FormInput',
                            __id: uuid(),
                            label: '输入框',
                            style: {paddingLeft: 16},
                            width: 200,
                        },
                        {
                            __type: 'FormSelect',
                            __id: uuid(),
                            type: 'select',
                            label: '下拉框',
                            style: {paddingLeft: 16},
                            width: 200,
                            options: [
                                {value: '1', label: '下拉项1'},
                                {value: '2', label: '下拉项2'},
                            ],
                        },
                        {
                            __type: 'FormElement',
                            __id: uuid(),
                            layout: true,
                            style: {paddingLeft: 16},
                            width: 'auto',
                            children: [
                                {
                                    __type: 'ButtonPrimary',
                                    __id: uuid(),
                                    type: 'primary',
                                    style: {marginRight: 8},
                                    children: [
                                        {
                                            __type: 'text',
                                            __id: uuid(),
                                            content: '查询',
                                        }
                                    ],
                                },
                                {
                                    __type: 'Button',
                                    __id: uuid(),
                                    type: 'default',
                                    children: [
                                        {
                                            __type: 'text',
                                            __id: uuid(),
                                            content: '重置',
                                        }
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
};
