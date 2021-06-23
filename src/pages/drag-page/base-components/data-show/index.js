import BadgeImage from './Badge.png';
import PopoverImage from './Popover.png';
import TabsImage from './Tabs.png';
import CarouselImage from './Carousel.png';
import AvatarImage from './Avatar.jpeg';
import ImageImage from './Image.png';

export default [
    {
        title: '头像',
        subTitle: '头像 Avatar',
        children: [
            {
                title: '头像',
                renderPreview: true,
                config: {
                    componentName: 'Avatar',
                    props: {
                        src: AvatarImage,
                    },
                },
            },
        ],
    },
    {
        title: '徽标数',
        subTitle: '徽标数 Badge',
        children: [
            {
                title: '徽标数',
                renderPreview: false,
                image: BadgeImage,
                config: {
                    componentName: 'Badge',
                    props: {
                        count: 5,
                    },
                },
            },
        ],
    },
    {
        title: '日历',
        subTitle: '日历 Calendar',
        children: [
            {
                title: '日历',
                renderPreview: true,
                previewZoom: .28,
                config: {
                    componentName: 'Calendar',
                },
            },
        ],
    },
    {
        title: '卡片',
        subTitle: '卡片 Card',
        children: [
            {
                title: '卡片',
                renderPreview: true,
                previewZoom: .7,
                previewProps: {style: {width: '100%'}},
                config: {
                    componentName: 'Card',
                    props: {
                        title: '卡片标题',
                    },
                },
            },
        ],
    },
    {
        title: '走马灯',
        subTitle: '走马灯 Carousel',
        children: [
            {
                title: '走马灯',
                image: CarouselImage,
                config: {
                    componentName: 'Carousel',
                    children: [
                        {
                            componentName: 'div',
                            children: [
                                {
                                    componentName: 'DragHolder',
                                    props: {
                                        style: {
                                            height: 200,
                                            color: '#fff',
                                            backgroundColor: '#507e10',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            componentName: 'div',
                            children: [
                                {
                                    componentName: 'DragHolder',
                                    props: {
                                        style: {
                                            height: 200,
                                            color: '#fff',
                                            backgroundColor: '#f3d80e',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            componentName: 'div',
                            children: [
                                {
                                    componentName: 'DragHolder',
                                    props: {
                                        style: {
                                            height: 200,
                                            color: '#fff',
                                            backgroundColor: '#221111',
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    },
    {
        title: '折叠面板',
        subTitle: '折叠面板 Collapse',
        children: [
            {
                title: '折叠面板',
                renderPreview: true,
                previewZoom: .7,
                previewProps: {style: {width: '100%'}},
                config: {
                    componentName: 'Collapse',
                    children: [
                        ...(['1', '2', '3'].map(item => {
                            return {
                                componentName: 'Collapse.Panel',
                                props: {
                                    key: item,
                                    header: '标题' + item,
                                },
                                children: [
                                    {
                                        componentName: 'DragHolder',
                                    },
                                ],
                            };
                        })),
                    ],
                },
            },
        ],
    },

    {
        title: '折叠面板页',
        subTitle: '折叠面板页 Collapse.Panel',
        children: [
            {
                title: '折叠面板页',
                renderPreview: false,
                config: {
                    componentName: 'Collapse.Panel',
                    props: {
                        key: 'key',
                        header: '标题',
                    },
                    children: [
                        {
                            componentName: 'div',
                            children: [
                                {
                                    componentName: 'DragHolder',
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    },
    {
        title: '评论',
        subTitle: '评论 Comment',
        children: [
            {
                title: '评论',
                renderPreview: true,
                config: {
                    componentName: 'Comment',
                },
            },
        ],
    },
    {
        title: '描述列表',
        subTitle: '描述列表 Descriptions',
        children: [
            {
                title: '描述列表',
                renderPreview: true,
                config: {
                    componentName: 'Descriptions',
                    children: [
                        {
                            componentName: 'Descriptions.Item',
                            props: {label: '标签1'},
                            children: [{componentName: 'Text', props: {text: '内容1'}}],
                        },
                        {
                            componentName: 'Descriptions.Item',
                            props: {label: '标签2'},
                            children: [{componentName: 'Text', props: {text: '内容2'}}],
                        },
                    ],
                },
            },
        ],
    },
    {
        title: '空状态',
        subTitle: '空状态 Empty',
        children: [
            {
                title: '空状态',
                renderPreview: true,
                config: {
                    componentName: 'Empty',
                },
            },
        ],
    },
    {
        title: '图片',
        subTitle: '图片 Image',
        children: [
            {
                title: '图片',
                renderPreview: true,
                config: {
                    componentName: 'Image',
                    props: {
                        src: ImageImage,
                    },
                },
            },
        ],
    },
    {
        title: '列表',
        subTitle: '列表 List',
        children: [
            {
                title: '列表',
                renderPreview: true,
                config: {
                    componentName: 'List',
                },
            },
        ],
    },
    {
        title: '气泡卡片',
        subTitle: '气泡卡片 Popover',
        children: [
            {
                title: '气泡卡片',
                renderPreview: true,
                // previewProps: {
                //     visible: true,
                //     getPopupContainer: e => e.parentNode,
                // },
                // previewWrapperStyle: {
                //     paddingTop: 120,
                // },
                image: PopoverImage,
                config: {
                    componentName: 'Popover',
                    props: {
                        title: '卡片标题',
                        content: {
                            componentName: 'div',
                            children: [
                                {componentName: 'DragHolder'},
                            ],
                        },
                    },
                    children: [
                        {
                            componentName: 'Text',
                            props: {
                                text: '气泡卡片',
                            },
                        },
                    ],

                },
            },
        ],
    },
    {
        title: '统计数值',
        subTitle: '统计数值 Statistic',
        children: [
            {
                title: '统计数值',
                renderPreview: true,
                config: {
                    componentName: 'Statistic',
                    props: {
                        title: '标题',
                        value: 888,
                    },
                },
            },
            {
                title: '倒计时',
                renderPreview: true,
                config: {
                    componentName: 'Statistic.Countdown',
                    props: {
                        title: '倒计时',
                        value: Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30,
                    },
                },
            },
        ],
    },
    {
        title: '表格',
        subTitle: '表格 Table',
        children: [
            {
                title: '表格',
                renderPreview: true,
                previewZoom: .8,
                previewProps: {style: {width: '100%'}},
                config: {
                    componentName: 'Table',
                    props: {
                        pagination: false,
                        dataSource: Array.from({length: 5}).map((item, index) => {
                            return {id: '' + index, name: '张三', age: 25};
                        }),
                        rowKey: 'id',
                    },
                    children: [ // 与 props.columns 对应
                        {componentName: 'Table.Column', props: {title: '姓名', dataIndex: 'name', render: {componentName: 'Text', props: {text: '张三'}}}},
                        {componentName: 'Table.Column', props: {title: '年龄', dataIndex: 'age', render: {componentName: 'Text', props: {text: 22}}}},
                        {
                            componentName: 'Table.Column',
                            props: {
                                title: '操作',
                                dataIndex: 'operator',
                                render: {
                                    componentName: 'div',
                                    children: [
                                        {
                                            componentName: 'a',
                                            children: [{
                                                componentName: 'Text',
                                                props: {
                                                    text: '修改',
                                                },
                                            }],
                                        },
                                        {
                                            componentName: 'Divider',
                                            props: {
                                                type: 'vertical',
                                            },
                                        },
                                        {
                                            wrapper: [
                                                {
                                                    componentName: 'Popconfirm',
                                                    props: {
                                                        title: '您确定删除吗？',
                                                    },
                                                },
                                            ],
                                            componentName: 'a',
                                            props: {
                                                style: {color: 'red'},
                                            },
                                            children: [{
                                                componentName: 'Text',
                                                props: {
                                                    text: '删除',
                                                },
                                            }],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                },
            },
        ],
    },
    {
        title: '表格列',
        subTitle: '表格列 Table.Column',
        children: [
            {
                title: '表格列',
                renderPreview: false,
                config: {
                    componentName: 'Table.Column',
                    props: {
                        title: '新增列',
                        dataIndex: 'newColumn',
                    },
                },
            },
        ],
    },
    {
        title: '标签页',
        subTitle: '标签页 Tabs',
        children: [
            {
                title: '标签页',
                image: TabsImage,
                config: {
                    componentName: 'Tabs',
                    props: {
                        defaultActiveKey: '1',
                        animated: {inkBar: true, tabPane: true},
                    },
                    children: [
                        ...(['1', '2', '3'].map(item => {

                            return {
                                componentName: 'Tabs.TabPane',
                                props: {
                                    key: item,
                                    tab: '标签' + item,
                                },
                                children: [
                                    {
                                        componentName: 'div',
                                        children: [
                                            {
                                                componentName: 'DragHolder',
                                            },
                                        ],
                                    },
                                ],
                            };
                        })),
                    ],
                },
            },
            {
                title: '标签页面',
                renderPreview: false,
                config: {
                    componentName: 'Tabs.TabPane',
                    props: {
                        key: 'key',
                        tab: '标签',
                    },
                    children: [
                        {
                            componentName: 'div',
                            children: [
                                {componentName: 'DragHolder'},
                            ],
                        },
                    ],
                },
            },
        ],
    },
    {
        title: '标签',
        subTitle: '标签 Tag',
        children: [
            {
                title: '标签',
                renderPreview: true,
                config: {
                    componentName: 'Tag',
                    props: {
                        color: 'red',
                    },
                    children: [
                        {componentName: 'Text', props: {text: '标签'}},
                    ],
                },
            },
        ],
    },
    {
        title: '时间轴',
        subTitle: '时间轴 Timeline',
        children: [
            {
                title: '时间轴',
                renderPreview: true,
                config: {
                    componentName: 'Timeline',
                    children: [
                        ...(Array.from({length: 3}).map((item, index) => {
                            return {
                                componentName: 'Timeline.Item',
                                props: {
                                    color: index === 0 ? 'green' : index === 2 ? 'red' : undefined,
                                },
                                children: [
                                    {componentName: 'Text', props: {text: '时间轴' + (index + 1)}},
                                ],
                            };
                        })),
                    ],
                },
            },
        ],
    },
    {
        title: '文字提示',
        subTitle: '文字提示 Tooltip',
        children: [
            {
                title: '文字提示',
                renderPreview: true,
                previewProps: {
                    visible: true,
                    getPopupContainer: e => e.parentNode,
                },
                previewWrapperStyle: {
                    paddingTop: 54,
                },
                config: {
                    componentName: 'Tooltip',
                    props: {
                        title: '文字提示',
                    },
                    children: [
                        {
                            componentName: 'Text',
                            props: {
                                text: '提示',
                            },
                        },
                    ],
                },
            },
        ],
    },
    {
        title: '树形控件',
        subTitle: '树形控件 Tree',
        children: [
            {
                title: '树形控件',
                renderPreview: true,
                config: {
                    componentName: 'Tree',
                    props: {
                        treeData: [
                            {
                                title: 'parent 1',
                                key: '0-0',
                                children: [
                                    {
                                        title: 'parent 1-0',
                                        key: '0-0-0',
                                        children: [
                                            {
                                                title: 'leaf',
                                                key: '0-0-0-0',
                                            },
                                            {
                                                title: 'leaf',
                                                key: '0-0-0-1',
                                            },
                                        ],
                                    },
                                    {
                                        title: 'parent 1-1',
                                        key: '0-0-1',
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        ],
    },
];
