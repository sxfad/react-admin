import uuid from "uuid/v4";

export const category = '原生HTML元素';

export default {
    text: {
        component: 'text',
        title: '纯文本',
        visible: false,
        defaultProps: {
            content: '纯文本',
        },
        render: props => props.content,
    },
    tip: {
        component: 'div',
        title: '文字说明',
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
        title: '行内元素（span）',
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
        title: '块级元素（div）',
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
    },
    divInline: {
        component: 'div',
        title: '行内块级元素（div）',
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
    },
};
