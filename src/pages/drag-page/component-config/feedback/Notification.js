export default {
    isContainer: false,
    isWrapper: true,
    freezeIsWrapper: true, // 锁定，不切换
    fields: [
        {
            label: '通知类型', field: 'type', type: 'radio-group',
            options: [
                {value: 'success', label: '成功'},
                {value: 'error', label: '错误'},
                {value: 'info', label: '信息'},
                {value: 'warning', label: '警告'},
            ],
            defaultValue: 'success',
            desc: '通知类型',
        },
        {label: '通知标题', field: 'message', type: [{value: 'string', label: '字符串'}, {value: 'ReactNode', label: '组件'}], desc: '通知提醒标题，必选'},
        {label: '通知内容', field: 'description', type: [{value: 'string', label: '字符串'}, {value: 'ReactNode', label: '组件'}], desc: '通知提醒内容，必选'},
        {label: '自定义图标', field: 'icon', type: 'ReactNode', desc: '自定义图标'},
        {
            label: '弹出位置', field: 'placement',
            type: 'radio-group',
            options: [
                {value: 'topLeft', label: '上左'},
                {value: 'topRight', label: '上右'},
                {value: 'bottomLeft', label: '下左'},
                {value: 'bottomRight', label: '下右'},
            ],
            defaultValue: 'topRight', desc: '弹出位置，可选 topLeft topRight bottomLeft bottomRight',
        },
        {label: '距离底部距离', field: 'bottom', appendField: {placement: ['bottomLeft', 'bottomRight']}, type: 'number', defaultValue: 24, desc: '消息从底部弹出时，距离底部的位置，单位像素'},
        {label: '距离顶部距离', field: 'top', appendField: {placement: ['topLeft', 'topRight']}, type: 'number', defaultValue: 24, desc: '消息从顶部弹出时，距离顶部的位置，单位像素'},
        {label: '关闭按钮', field: 'btn', type: 'ReactNode', desc: '自定义关闭按钮'},
        {label: '关闭图标', field: 'closeIcon', type: 'ReactNode', desc: '自定义关闭图标'},
        {label: '关闭延迟', field: 'duration', type: 'number', defaultValue: 4.5, desc: '默认 4.5 秒后自动关闭，配置为 null 则不自动关闭'},
    ],
};

/*
bottom	消息从底部弹出时，距离底部的位置，单位像素	number	24
btn	自定义关闭按钮	ReactNode	-
className	自定义 CSS class	string	-
closeIcon	自定义关闭图标	ReactNode	-
description	通知提醒内容，必选	ReactNode	-
duration	默认 4.5 秒后自动关闭，配置为 null 则不自动关闭	number	4.5
getContainer	配置渲染节点的输出位置	() => HTMLNode	() => document.body
icon	自定义图标	ReactNode	-
key	当前通知唯一标志	string	-
message	通知提醒标题，必选	ReactNode	-
placement	弹出位置，可选 topLeft topRight bottomLeft bottomRight	string	topRight
style	自定义内联样式	CSSProperties	-
top	消息从顶部弹出时，距离顶部的位置，单位像素	number	24
onClick	点击通知时触发的回调函数	function	-
onClose	当通知关闭时触发	function	-
* */
