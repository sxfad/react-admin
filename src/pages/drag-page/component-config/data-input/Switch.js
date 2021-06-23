export default {
    isFormElement: true,
    isContainer: false,
    fields: [
        // {label: '选中', category: '选项', field: 'checked', type: 'boolean', defaultValue: false, version: '', desc: '指定当前是否选中'},
        {label: '禁用', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '值为 true 时，滑块为禁用状态'},
        {label: '选中显示', field: 'checkedChildren', type: 'ReactNode', defaultValue: false, version: '', desc: '选中时的内容'},
        {label: '非选中显示', field: 'unCheckedChildren', type: 'ReactNode', defaultValue: false, version: '', desc: '非选中时的内容'},

        {
            label: '控件大小', field: 'size', type: 'radio-group', version: '',
            options: [
                {value: 'default', label: '默认'},
                {value: 'small', label: '小号'},
            ],
            defaultValue: 'default',
            desc: '控件大小。注：标准表单内的输入框大小限制为 large',
        },
    ],
};
/*
autoFocus	组件自动获取焦点	boolean	false
checked	指定当前是否选中	boolean	false
checkedChildren	选中时的内容	ReactNode	-
className	Switch 器类名	string	-
defaultChecked	初始是否选中	boolean	false
disabled	是否禁用	boolean	false
loading	加载中的开关	boolean	false
size	开关大小，可选值：default small	string	default
unCheckedChildren	非选中时的内容	ReactNode	-
onChange	变化时回调函数	function(checked: boolean, event: Event)	-
onClick	点击时回调函数	function(checked: boolean, event: Event)	-
* */
