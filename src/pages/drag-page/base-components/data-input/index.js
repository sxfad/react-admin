import React from 'react';
import {Select} from 'antd';

export default [
    {
        title: '自动完成',
        subTitle: '自动完成 AutoComplete',
        children: [
            {
                title: '自动完成',
                renderPreview: true,
                config: {
                    componentName: 'AutoComplete',
                    props: {
                        style: {width: '100%'},
                        placeholder: '请输入',
                        options: [
                            {value: '@qq.com'},
                            {value: '@163.com'},
                            {value: '@qiye.com'},
                        ],
                    },
                },
            },
        ],
    },
    {
        title: '级联选择',
        subTitle: '级联选择 Cascader',
        children: [
            {
                title: '级联选择',
                renderPreview: true,
                config: {
                    componentName: 'Cascader',
                    props: {
                        placeholder: '请选择',
                        options: [
                            {
                                label: '北京',
                                value: 'beijing',
                                children: [
                                    {
                                        label: '石景山',
                                        value: 'shijingshan',
                                        children: [
                                            {
                                                label: '苹果园',
                                                value: 'pingguoyuan',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                label: '江苏',
                                value: 'jiangsu',
                                children: [
                                    {
                                        label: '南京',
                                        value: 'nanjing',
                                        children: [
                                            {
                                                label: '中华门',
                                                value: 'zhonghuamen',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        ],
    },
    {
        title: '多选框',
        subTitle: '多选框 Checkbox',
        children: [
            {
                title: '多选框',
                renderPreview: true,
                previewProps: {checked: true},
                config: {
                    componentName: 'Checkbox',
                },
            },
            {
                title: '多选框组',
                renderPreview: true,
                previewProps: {checked: ['1', '2']},
                config: {
                    componentName: 'Checkbox.Group',
                    props: {
                        options: [
                            {value: '1', label: '唱歌'},
                            {value: '2', label: '跳舞'},
                        ],
                    },
                },
            },
        ],
    },
    {
        title: '日期选择框',
        subTitle: '日期选择框 DatePicker',
        children: [
            {
                title: '日期选择框',
                renderPreview: true,
                config: {
                    componentName: 'DatePicker',
                },
            },
            {
                title: '日期区间',
                renderPreview: true,
                config: {
                    componentName: 'DatePicker.RangePicker',
                },
            },
        ],
    },
    {
        title: '输入框',
        subTitle: '输入框 Input',
        children: [
            {
                title: '输入框',
                renderPreview: true,
                config: {
                    componentName: 'Input',
                    props: {
                        placeholder: '请输入',
                    },
                },
            },
            {
                title: '文本输入框',
                renderPreview: true,
                config: {
                    componentName: 'Input.TextArea',
                    props: {
                        placeholder: '请输入',
                    },
                },
            },
            {
                title: '搜索输入框',
                renderPreview: true,
                config: {
                    componentName: 'Input.Search',
                    props: {
                        placeholder: '请输入',
                    },
                },
            },
            {
                title: '密码输入框',
                renderPreview: true,
                config: {
                    componentName: 'Input.Password',
                    props: {
                        placeholder: '请输入',
                    },
                },
            },
            {
                title: '数字输入框',
                renderPreview: true,
                config: {
                    componentName: 'InputNumber',
                    props: {
                        style: {width: '100%'},
                        placeholder: '请输入数字',
                    },
                },
            },
        ],
    },
    {
        title: '提及',
        subTitle: '提及 Mentions',
        children: [
            {
                title: '提及',
                renderPreview: true,
                config: {
                    componentName: 'Mentions',
                    props: {
                        placeholder: '请输入',
                    },
                },
            },
        ],
    },
    {
        title: '单选框',
        subTitle: '单选框 Radio',
        children: [
            {
                title: '单选框',
                renderPreview: true,
                previewProps: {checked: true},
                config: {
                    componentName: 'Radio',
                    children: [
                        {
                            componentName: 'Text',
                            props: {
                                text: '选项',
                            },
                        },
                    ],
                },
            },
            {
                title: '单选框按钮',
                renderPreview: true,
                previewProps: {checked: true},
                config: {
                    componentName: 'Radio.Button',
                    children: [
                        {
                            componentName: 'Text',
                            props: {
                                text: '选项',
                            },
                        },
                    ],
                },
            },
            {
                title: '单选组',
                renderPreview: true,
                previewProps: {value: '1'},
                config: {
                    componentName: 'Radio.Group',
                    props: {
                        options: [
                            {value: '1', label: '选项1'},
                            {value: '2', label: '选项2'},
                        ],
                    },
                },
            },
        ],
    },
    {
        title: '评分',
        subTitle: '评分 Rate',
        children: [
            {
                title: '评分',
                renderPreview: true,
                previewZoom: .7,
                config: {
                    componentName: 'Rate',
                    props: {
                        allowHalf: true,
                        value: 2.5,
                    },
                },
            },
        ],
    },
    {
        title: '选择器',
        subTitle: '选择器 Select',
        children: [
            {
                title: '选择器',
                renderPreview: node => {
                    const container = {current: null};
                    return (
                        <div
                            ref={container}
                            style={{position: 'relative', height: 100, width: '100%'}}
                        >
                            <Select
                                {...node.props}
                                getPopupContainer={() => container.current}
                                open
                            />
                        </div>
                    );
                },
                // previewStyle: {width: '100%'},
                config: {
                    componentName: 'Select',
                    props: {
                        placeholder: '请选择',
                        allowClear: true,
                        options: [
                            {value: '1', label: '下拉项1'},
                            {value: '2', label: '下拉项2'},
                        ],
                        style: {width: '100%'},
                    },
                },
            },
        ],
    },
    {
        title: '滑动输入条',
        subTitle: '滑动输入条 Slider',
        children: [
            {
                title: '滑动输入条',
                renderPreview: true,
                previewStyle: {width: '100%'},
                // previewWrapperStyle: {background: 'red'},
                config: {
                    componentName: 'Slider',
                    props: {
                        value: 50,
                    },
                },
            },
            {
                title: '双滑动',
                renderPreview: true,
                previewStyle: {width: '100%'},
                // previewWrapperStyle: {background: 'red'},
                config: {
                    componentName: 'Slider',
                    props: {
                        value: [20, 70],
                        range: true,
                    },
                },
            },
        ],
    },
    {
        title: '开关',
        subTitle: '开关 Switch',
        children: [
            {
                title: '开关',
                renderPreview: true,
                config: {
                    componentName: 'Switch',
                },
            },
        ],
    },
    {
        title: '时间选择框',
        subTitle: '时间选择框 TimePicker',
        children: [
            {
                title: '时间选择框',
                renderPreview: true,
                config: {
                    componentName: 'TimePicker',
                },
            },
            {
                title: '时间区间选择框',
                renderPreview: true,
                config: {
                    componentName: 'TimePicker.RangePicker',
                },
            },
        ],
    },
    {
        title: '穿梭框',
        subTitle: '穿梭框 Transfer',
        children: [
            {
                title: '穿梭框',
                renderPreview: true,
                previewZoom: .28,
                config: {
                    componentName: 'Transfer',
                },
            },
        ],
    },
    {
        title: '树选择',
        subTitle: '树选择 TreeSelect',
        children: [
            {
                title: '树选择',
                renderPreview: true,
                config: {
                    componentName: 'TreeSelect',
                    props: {
                        style: {width: '100%'},
                        placeholder: '请选择',
                        treeData: [
                            {
                                title: 'Node1',
                                value: '0-0',
                                children: [
                                    {
                                        title: 'Child Node1',
                                        value: '0-0-1',
                                    },
                                    {
                                        title: 'Child Node2',
                                        value: '0-0-2',
                                    },
                                ],
                            },
                            {
                                title: 'Node2',
                                value: '0-1',
                            },
                        ],
                    },
                },
            },
        ],
    },
    {
        title: '上传',
        subTitle: '上传 Upload',
        children: [
            {
                title: '上传',
                renderPreview: true,
                config: {
                    componentName: 'Upload',
                    children: [
                        {
                            componentName: 'Button',
                            props: {
                                icon: {
                                    componentName: 'UploadOutlined',
                                },
                            },
                            children: [
                                {
                                    componentName: 'Text',
                                    props: {
                                        text: '请选择文件',
                                    },
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    },
];
