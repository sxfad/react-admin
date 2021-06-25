export default [
    {
        title: '固钉',
        subTitle: '固钉 Affix',
        children: [
            {
                title: '固钉',
                renderPreview: false,
                config: {
                    componentName: 'Affix',
                },
            },
        ],
    },
    {
        title: '面包屑',
        subTitle: '面包屑 Breadcrumb',
        children: [
            {
                title: '面包屑',
                renderPreview: true,
                previewZoom: .8,
                config: {
                    componentName: 'Breadcrumb',
                    children: [
                        {
                            componentName: 'Breadcrumb.Item',
                            children: [{componentName: 'Text', props: {text: '首页'}}],
                        },
                        {
                            componentName: 'Breadcrumb.Item',
                            children: [{componentName: 'Text', props: {text: '页面1'}}],
                        },
                        {
                            componentName: 'Breadcrumb.Item',
                            children: [{componentName: 'Text', props: {text: '页面2'}}],
                        },
                        {
                            componentName: 'Breadcrumb.Item',
                            children: [{componentName: 'Text', props: {text: '页面3'}}],
                        },
                    ],
                },
            },
            {
                title: '面包屑项',
                renderPreview: true,
                config: {
                    componentName: 'Breadcrumb.Item',
                    children: [{componentName: 'Text', props: {text: '页面'}}],
                },
            },
        ],
    },
    {
        title: '下拉菜单',
        subTitle: '下拉菜单 Dropdown',
        children: [
            {
                title: '下拉菜单',
                renderPreview: false,
                config: {
                    componentName: 'Dropdown',
                },
            },
        ],
    },
    {
        title: '导航菜单',
        subTitle: '导航菜单 Menu',
        children: [
            {
                title: '导航菜单',
                renderPreview: true,
                config: {
                    componentName: 'Menu',
                    props: {
                        mode: 'inline',
                    },
                    children: [
                        {
                            componentName: 'Menu.SubMenu',
                            props: {
                                key: 's1',
                                icon: {componentName: 'MenuOutlined'},
                                title: '子菜单1',
                            },
                            children: [
                                {
                                    componentName: 'Menu.ItemGroup',
                                    props: {key: 'g1', title: '菜单分组1'},
                                    children: [
                                        {
                                            componentName: 'Menu.Item', props: {key: 'm1'},
                                            children: [
                                                {componentName: 'Text', props: {text: '菜单1'}},
                                            ],
                                        },
                                        {
                                            componentName: 'Menu.Item', props: {key: 'm2'},
                                            children: [
                                                {componentName: 'Text', props: {text: '菜单2'}},
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            },
            {
                title: '子菜单',
                renderPreview: false,
                config: {
                    componentName: 'Menu.SubMenu',
                    props: {
                        key: 's',
                        title: '子菜单',
                    },
                    children: [
                        {
                            componentName: 'Menu.Item', props: {key: 'm1'},
                            children: [
                                {componentName: 'Text', props: {text: '菜单1'}},
                            ],
                        },
                    ],
                },
            },
            {
                title: '分组菜单',
                renderPreview: false,
                config: {
                    componentName: 'Menu.ItemGroup',
                    props: {key: 'g', title: '菜单分组'},
                    children: [
                        {
                            componentName: 'Menu.Item', props: {key: 'm1'},
                            children: [
                                {componentName: 'Text', props: {text: '菜单1'}},
                            ],
                        },
                        {
                            componentName: 'Menu.Item', props: {key: 'm2'},
                            children: [
                                {componentName: 'Text', props: {text: '菜单2'}},
                            ],
                        },
                    ],
                },
            },
            {
                title: '菜单项',
                renderPreview: false,
                config: {
                    componentName: 'Menu.Item',
                    props: {key: 'm'},
                    children: [
                        {componentName: 'Text', props: {text: '菜单'}},
                    ],
                },
            },
        ],
    },
    {
        title: '页头',
        subTitle: '页头 PageHeader',
        children: [
            {
                title: '页头',
                renderPreview: false,
                config: {
                    componentName: 'PageHeader',
                    props: {
                        title: '标题',
                        subTitle: '子标题',
                    },
                },
            },
        ],
    },
    {
        title: '步骤条',
        subTitle: '步骤条 Steps',
        children: [
            {
                title: '步骤条',
                renderPreview: false,
                config: {
                    componentName: 'Steps',
                    props: {
                        current: 1,
                    },
                    children: [
                        {
                            componentName: 'Steps.Step',
                            props: {
                                title: 'Finished',
                                description: 'This is a description.',
                            },
                        },
                        {
                            componentName: 'Steps.Step',
                            props: {
                                title: 'In Progress',
                                subTitle: 'Left 00:00:08',
                                description: 'This is a description.',
                            },
                        },
                        {
                            componentName: 'Steps.Step',
                            props: {
                                title: 'Waiting',
                                description: 'This is a description.',
                            },
                        },
                    ],
                },
            },
        ],
    },
];
