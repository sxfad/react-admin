import {FormElement, FormRow} from '@/library/antd';
import _ from 'lodash';
import {isJson} from "@/commons";

export const category = '表单元素';

const optionsValidator = {
    validator: (rule, value, callback) => {
        if (!value) return callback();

        const isJsonStr = isJson(value);
        if (!isJsonStr) return callback('请输入正确的JSON各式数据');

        const options = JSON.parse(value);
        if (!_.isArray(options)) return callback('整体数据必须是数组');

        for (let i = 0; i < options.length; i++) {
            const val = options[i];
            if (!_.isPlainObject(val)) return callback('每一项必须是包含value、label属性的对象');

            if (!('value' in val && 'label' in val)) return callback('每一项必须是包含value、label属性的对象');

            const values = options.filter(item => item.value === val.value);
            if (values.length > 1) return callback(`"value": "${val.value}" 已存在，value值不可重复`);

            const labels = options.filter(item => item.label === val.label);
            if (labels.length > 1) return callback(`"label": "${val.label}" 已存在，label值不可重复`);
        }

        return callback();
    }
};

export const optionsTypes = [
    {value: '01', label: '是否', options: [{value: '1', label: '是'}, {value: '0', label: '否'}]},
    {value: '02', label: '状态', options: [{value: '1', label: '启用'}, {value: '0', label: '禁用'}]},
    {value: 'customer', label: '自定义', options: [{value: '1', label: '项1'}, {value: '2', label: '项2'}]},
];

function getOptionsAttribute(name) {
    return [
        {
            name,
            attribute: 'optionsType',
            valueType: 'string',
            formType: 'select',
            options: optionsTypes,
            ignoreAttribute: true,
        },
        {
            name: `自定义${name}`,
            attribute: 'customerOptions',
            valueType: 'json',
            formType: 'json',
            label: '',
            height: '200px',
            defaultValue: [{value: '1', label: '项1'}, {value: '2', label: '项2'}],
            visible: values => values.optionsType === 'customer',
            ignoreAttribute: true,
            rules: [
                optionsValidator,
            ],
            tabSize: 2,
            // showGutter: false,
            // showPrintMargin: false,
        },
    ];
}

const allowClear = (half) => ({
    name: '可清除',
    attribute: 'allowClear',
    valueType: 'boolean',
    defaultValue: false,
    formType: 'switch',
    half,
    checkedChildren: '是',
    unCheckedChildren: '否',
});

const commonProps = [
    {
        name: '字段名',
        attribute: 'field',
        valueType: 'string',
    },
    {
        name: '标签',
        attribute: 'label',
        valueType: 'string',
    },
    {
        name: '提示',
        attribute: 'tip',
        valueType: 'string',
    },
    {
        name: '总宽度',
        attribute: 'width',
        valueType: 'string',
        defaultValue: 'auto',
        placeholder: '比如：200px 或者 auto',
    },
    {
        name: '标签宽度',
        attribute: 'labelWidth',
        valueType: 'string',
        placeholder: '比如：200px 或者 auto',
    },
    {
        name: '占位文案',
        attribute: 'placeholder',
        valueType: 'string',
        placeholder: '为空时的提示文案',
    },
];

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
            width: '200px',
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
            width: '200px',
            optionFilterProp: 'children',
            options: [
                {value: '1', label: '下拉项1'},
                {value: '2', label: '下拉项2'},
            ],
        },
        props: [
            ...commonProps,
            ...getOptionsAttribute('下拉项'),
            {
                name: '可搜索',
                attribute: 'showSearch',
                valueType: 'boolean',
                defaultValue: false,
                formType: 'switch',
                half: true,
                checkedChildren: '是',
                unCheckedChildren: '否',
            },
            allowClear(true),
            {
                name: '搜索范围',
                attribute: 'optionFilterProp',
                valueType: 'string',
                defaultValue: 'value',
                formType: 'select',
                visible: values => values.showSearch,
                options: [
                    {value: 'value', label: '内部值'},
                    {value: 'children', label: '显示的内容'},
                ],
            },
        ],
    },
};
