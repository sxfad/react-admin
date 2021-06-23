import React from 'react';
import theme from '../../../../theme.less';

export default [
    {
        title: '按钮',
        subTitle: '按钮 Button',
        children: [
            ...[
                {title: '主按钮', type: 'primary', text: '确定'},
                {title: '次按钮', text: '取消'},
                {title: '危险按钮', type: 'primary', danger: true, text: '删除'},
                {title: '虚线按钮', type: 'dashed'},
                {title: '文本按钮', type: 'text'},
                {title: '连接按钮', type: 'link'},
            ].map(item => {
                const {title, text, type, danger} = item;
                return {
                    title,

                    // 预览渲染config配置的组件
                    renderPreview: true,
                    config: {
                        componentName: 'Button',
                        props: {
                            type,
                            danger,
                        },
                        children: [
                            {
                                componentName: 'Text',
                                props: {
                                    text: text || title,
                                    isDraggable: false,
                                },
                            },
                        ],
                    },
                };
            }),
        ],
    },
    {
        title: '栅格',
        subTitle: '栅格 Grid',
        children: [
            {
                title: '栅格行',
                renderPreview: (
                    <div style={{flex: 1}}>
                        <div style={{flex: 1, margin: 4, height: 10, background: theme.primaryColor}}/>
                        <div style={{flex: 1, margin: 4, height: 10, background: theme.primaryColor}}/>
                    </div>
                ),
                config: {
                    componentName: 'Row',
                },
            },
            {
                title: '栅格列',
                renderPreview: (
                    <div style={{flex: 1, display: 'flex'}}>
                        {Array.from({length: 6}).map(() => {
                            return <div style={{flex: 1, margin: 4, height: 20, background: theme.primaryColor}}/>;
                        })}
                    </div>
                ),
                config: {
                    componentName: 'Col',
                },
            },
            ...[
                {title: '一行两列', count: 2},
                {title: '一行三列', count: 3},
            ].map((item) => ({
                title: item.title,
                // 预览渲染组件配置
                renderPreview: (
                    <div style={{flex: 1, display: 'flex'}}>
                        {Array.from({length: item.count}).map(() => (
                            <div style={{flex: 1, margin: 4, height: 10, background: theme.primaryColor}}/>
                        ))}
                    </div>
                ),
                config: {
                    componentName: 'Row',
                    children: [
                        ...Array.from({length: item.count}).map(() => ({
                            componentName: 'Col',
                            props: {
                                span: 24 / item.count,
                            },
                            children: [
                                {
                                    componentName: 'DragHolder',
                                    props: {
                                        style: {height: 45},
                                    },
                                },
                            ],
                        })),
                    ],
                },
            })),
        ],
    },
    {
        title: '分割线',
        subTitle: '分割线 Divider',
        children: [
            {
                title: '分割线',
                config: {
                    componentName: 'Divider',
                    props: {
                        type: 'vertical',
                    },
                },
            },
        ],
    },
    {
        title: '间距',
        subTitle: '间距 Space',
        children: [
            {
                title: '间距',
                config: {
                    componentName: 'Space',
                },
            },
        ],
    },
];
