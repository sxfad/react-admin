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
    QueryBar: {
        component: QueryBar,
        title: '查询条件',
        container: true,
        direction: 'horizontal',
        import: 'import {QueryBar} from \'@/library/antd\';',
        defaultProps: {
            children: [
                {
                    __type: 'Button',
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
    },
};
