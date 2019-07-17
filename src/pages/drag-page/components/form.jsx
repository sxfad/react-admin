import {FormElement, FormRow} from '@/library/antd';

export const category = '表单元素';

export default {
    FormRow: {
        component: FormRow,
        title: '表单行',
        container: true,
        dependence: '@/library/antd',
        description: '用于。。。',
    },
    FormElement: {
        component: FormElement,
        title: '表单元素',
        visible: false,
        dependence: '@/library/antd',
    },

    FormInput: {
        component: FormElement,
        tagName: 'FormElement',
        showTagName: 'Input',
        title: '输入框',
        dependence: '@/library/antd',
        description: '文本输入框。',
        defaultProps: {
            label: '输入框',
            style: {paddingLeft: 16},
            width: 200,
        },
    },
    FormSelect: {
        component: FormElement,
        tagName: 'FormElement',
        showTagName: 'Select',
        title: '下拉框',
        dependence: '@/library/antd',
        description: '下拉选择。',
        defaultProps: {
            type: 'select',
            label: '下拉框',
            style: {paddingLeft: 16},
            width: 200,
            options: [
                {value: '1', label: '下拉项1'},
                {value: '2', label: '下拉项2'},
            ],
        },
    },
};
