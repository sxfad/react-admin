export default {
    isContainer: false,
    isWrapper: true,
    freezeIsWrapper: true, // 锁定，不切换
    fields: [
        {
            label: '提示类型', field: 'type', type: 'radio-group',
            options: [
                {value: 'success', label: '成功'},
                {value: 'error', label: '错误'},
                {value: 'info', label: '信息'},
                {value: 'warning', label: '警告'},
                {value: 'loading', label: '加载中'},
            ],
            defaultValue: 'success',
            desc: '通知类型',
        },
        {
            label: '提示内容', field: 'content', type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},
                {
                    value: 'Object', label: '详细配置',
                    fields: [
                        {label: '提示内容', field: 'content', type: [{value: 'string', label: '字符串'}, {value: 'ReactNode', label: '组件'}], desc: '提示内容'},
                        {label: '关闭延迟', field: 'duration', type: 'number', defaultValue: 3, desc: '自动关闭的延时，单位秒。设为 0 时不自动关闭'},
                        {label: '自定义图标', field: 'icon', type: 'ReactNode', desc: '自定义图标'},
                    ],
                },
            ], desc: '通知提醒标题，必选',
        },
        {label: '关闭延迟', field: 'duration', type: 'number', defaultValue: 3, desc: '自动关闭的延时，单位秒。设为 0 时不自动关闭'},
    ],
};
/*
className	自定义 CSS class	string	-
content	提示内容	ReactNode	-
duration	自动关闭的延时，单位秒。设为 0 时不自动关闭	number	3
icon	自定义图标	ReactNode	-
key	当前提示的唯一标志	string | number	-
style	自定义内联样式	CSSProperties	-
onClose	关闭时触发的回调函数	function	-
onClick	点击 message 时触发的回调函数	function	-
* */
