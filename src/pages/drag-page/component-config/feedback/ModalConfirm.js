export default {
    editableContents: [
        {
            selector: '.ant-modal-confirm-title',
            propsField: 'title',
        },
        {
            selector: '.ant-modal-confirm-content',
            propsField: 'content',
        },
    ],
    isWrapper: true,
    freezeIsWrapper: true, // 锁定，不切换
    fields: [
        {label: '弹框标题', field: 'title', type: 'string', version: '', desc: '标题'},
        {label: '弹框内容', field: 'content', type: [{value: 'string', label: '字符串'}, {value: 'ReactNode', label: '组件'}], version: '', desc: '标题'},
        {label: '弹框宽度', field: 'width', type: 'unit', defaultValue: 416, version: '', desc: '宽度'},
        {label: '遮罩', category: '选项', field: 'mask', type: 'boolean', defaultValue: true, version: '', desc: '是否展示遮罩'},
        {label: '遮罩可关闭', category: '选项', field: 'maskClosable', type: 'boolean', defaultValue: false, version: '', desc: '点击蒙层是否允许关闭'},
        {label: 'esc关闭', category: '选项', field: 'keyboard', type: 'boolean', defaultValue: true, version: '', desc: '是否支持键盘 esc 关闭'},
        {label: '垂直居中', category: '选项', field: 'centered', type: 'boolean', defaultValue: false, version: '', desc: '垂直居中展示 Modal'},
        {label: '确认按钮文字', field: 'okText', appendField: {footer: undefined}, type: 'string', defaultValue: '确定', version: '', desc: '确认按钮文字'},
        {label: '取消按钮文字', field: 'cancelText', appendField: {footer: undefined}, type: 'string', defaultValue: '取消', version: '', desc: '取消按钮文字'},
        {label: '     z-index', field: 'zIndex', type: 'number', defaultValue: 1000, version: '', desc: '设置 Modal 的 z-index'},
    ],
};
