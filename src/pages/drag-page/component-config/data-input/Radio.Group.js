import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    isFormElement: true,
    isContainer: false,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [
        {label: '禁用', field: 'disabled', type: 'boolean'},
        {label: '选项配置', field: 'options', type: 'options'},
        {
            label: '选项类型', field: 'optionType', type: 'radio-group',
            options: [
                {value: 'default', label: '默认'},
                {value: 'button', label: '按钮'},
            ],
            defaultValue: 'default',
        },
        {
            label: '按钮风格',
            field: 'buttonStyle',
            appendField: {optionType: 'button'},
            type: 'radio-group',
            options: [
                {value: 'outline', label: '次要按钮'},
                {value: 'solid', label: '主要按钮'},
            ],
            defaultValue: 'outline',
        },
        {
            label: '控件大小', field: 'size', type: 'radio-group', version: '',
            options: [
                {value: 'large', label: '大号'},
                {value: 'middle', label: '中号'},
                {value: 'small', label: '小号'},
            ],
            desc: '控件大小。注：标准表单内的输入框大小限制为 large',
        },

    ],
};
/*
buttonStyle	RadioButton 的风格样式，目前有描边和填色两种风格	outline | solid	outline
defaultValue	默认选中的值	any	-
disabled	禁选所有子单选器	boolean	false
name	RadioGroup 下所有 input[type="radio"] 的 name 属性	string	-
options	以配置形式设置子元素	string[] | Array<{ label: string value: string disabled?: boolean }>	-
optionType	用于设置 Radio options 类型	default | button	default	4.4.0
size	大小，只对按钮样式生效	large | middle | small	-
value	用于设置当前选中的值	any	-
onChange	选项变化时的回调函数	function(e:Event)	-
* */
