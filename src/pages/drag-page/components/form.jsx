import {FormElement, FormRow} from '@/library/components';
import _ from 'lodash';
import {isJson} from "@/library/utils";

export const category = '表单元素';

export const icon = 'form';

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

const showSearch = (half) => ({
    name: '可搜索',
    attribute: 'showSearch',
    valueType: 'boolean',
    defaultValue: false,
    formType: 'switch',
    half,
    checkedChildren: '是',
    unCheckedChildren: '否',
});

const optionFilterProp = (withShowSearch) => {
    return {
        name: '搜索范围',
        attribute: 'optionFilterProp',
        valueType: 'string',
        defaultValue: 'value',
        formType: 'select',
        visible: withShowSearch ? values => values.showSearch : true,
        options: [
            {value: 'value', label: '内部值'},
            {value: 'children', label: '显示的内容'},
        ],
    };
};
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
    {
        name: '是否必填',
        attribute: 'required',
        valueType: 'boolean',
        defaultValue: false,
        formType: 'switch',
        checkedChildren: '是',
        unCheckedChildren: '否',
        half: true,
    },
];

const commonConfig = {
    component: FormElement,
    tagName: 'FormElement',
    toSource: options => {
        const {
            decorators,
            imports,
        } = options;

        if (!imports.find(item => item.tagName === 'Form' && item.dependence === 'antd')) {
            imports.push({tagName: 'Form', dependence: 'antd'})
        }

        const formDecorator = '@Form.create()';
        if (!decorators.find(item => item === formDecorator)) {
            decorators.push(formDecorator);
        }

        console.log(imports);
        return true;
    },
};

export default {
    FormRow: {
        component: FormRow,
        title: '表单行',
        container: true,
        dependence: '@/library/components',
        description: '用于。。。',
    },
    FormElement: {
        component: FormElement,
        container: true,
        originSize: true,
        title: '表单元素',
        visible: false,
        dependence: '@/library/components',
        props: [
            {
                name: '总宽度',
                attribute: 'width',
                valueType: 'string',
                defaultValue: 'auto',
                placeholder: '比如：200px 或者 auto',
            },
        ],
    },

    FormInput: {
        component: FormElement,
        tagName: 'FormElement',
        showTagName: 'Input',
        title: '输入框',
        dependence: '@/library/components',
        description: '文本输入框。',
        defaultProps: {
            label: '输入框',
            width: '200px',
            allowClear: true,
        },
        props: [
            ...commonProps,
            allowClear(true),
        ],
    },
    FormNumber: {
        ...commonConfig,
        showTagName: 'Number',
        title: '数字框',
        dependence: '@/library/components',
        description: '数字输入框。',
        defaultProps: {
            type: 'number',
            label: '数字框',
            width: '200px',
        },
        props: [
            ...commonProps,
        ],
    },
    FormTextArea: {
        ...commonConfig,
        showTagName: 'TextArea',
        title: '文本框',
        dependence: '@/library/components',
        description: '文本输入框。',
        defaultProps: {
            type: 'textarea',
            label: '文本框',
        },
        props: [
            ...commonProps,
            {
                name: '行数',
                attribute: 'rows',
                valueType: 'number',
            },
        ],
    },
    FormPassword: {
        ...commonConfig,
        showTagName: 'Password',
        title: '密码框',
        dependence: '@/library/components',
        description: '密码输入框。',
        defaultProps: {
            type: 'password',
            label: '密码框',
            width: '200px',
        },
        props: [
            ...commonProps,
        ],
    },
    FormSelect: {
        ...commonConfig,
        showTagName: 'Select',
        title: '下拉框',
        dependence: '@/library/components',
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
            showSearch(true),
            allowClear(true),
            optionFilterProp(true),
        ],
    },
    FormSelectTree: {
        ...commonConfig,
        showTagName: 'SelectTree',
        title: '下拉树',
        dependence: '@/library/components',
        description: '下拉树选择。',
        defaultProps: {
            type: 'select-tree',
            label: '下拉树',
            width: '200px',
            optionFilterProp: 'children',
            options: [
                {
                    value: '1', label: '选项1',
                    children: [
                        {value: '2', label: '选项2'},
                        {value: '22', label: '选项22'}
                    ]
                },
            ],
        },
        props: [
            ...commonProps,
            showSearch(true),
            allowClear(true),
            optionFilterProp(true),
        ],
    },
    FormCheckbox: {
        ...commonConfig,
        showTagName: 'Checkbox',
        title: '复选框',
        dependence: '@/library/components',
        description: '单个复选框',
        defaultProps: {
            type: 'checkbox',
            label: '复选框',
            width: '100px',
        },
        props: [
            ...commonProps,
        ],
    },
    FormCheckboxGroup: {
        ...commonConfig,
        showTagName: 'CheckboxGroup',
        title: '复选组',
        dependence: '@/library/components',
        description: '一组复选框',
        defaultProps: {
            type: 'checkbox-group',
            label: '复选框',
            width: '400px',
            options: [
                {value: '1', label: '选项1'},
                {value: '2', label: '选项2'},
            ],
        },
        props: [
            ...commonProps,
            ...getOptionsAttribute('复选项'),
        ],
    },

    FormRadio: {
        ...commonConfig,
        showTagName: 'Radio',
        title: '单选框',
        dependence: '@/library/components',
        description: '单个单选框',
        defaultProps: {
            type: 'radio',
            label: '单选框',
            width: '100px',
        },
        props: [
            ...commonProps,
        ],
    },
    FormRadioGroup: {
        ...commonConfig,
        showTagName: 'RadioGroup',
        title: '单选框组',
        dependence: '@/library/components',
        description: '一组单选框',
        defaultProps: {
            type: 'radio-group',
            label: '单选框',
            width: '400px',
            options: [
                {value: '1', label: '选项1'},
                {value: '2', label: '选项2'},
            ],
        },
        props: [
            ...commonProps,
            ...getOptionsAttribute('单选项'),
        ],
    },
    FormRadioButton: {
        ...commonConfig,
        showTagName: 'RadioButton',
        title: '单选按钮',
        dependence: '@/library/components',
        description: '单选按钮',
        defaultProps: {
            type: 'radio-button',
            label: '单选按钮',
            width: '400px',
            options: [
                {value: '1', label: '选项1'},
                {value: '2', label: '选项2'},
            ],
        },
        props: [
            ...commonProps,
            ...getOptionsAttribute('单选项'),
        ],
    },
    FormCascader: {
        ...commonConfig,
        showTagName: 'Cascader',
        title: '级联选择',
        dependence: '@/library/components',
        description: '级联选择，适用于省市区选择等场景',
        defaultProps: {
            type: 'cascader',
            label: '级联选择',
            width: '400px',
            options: [
                {
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'shijingshan',
                            label: '石景山区',
                            children: [
                                {
                                    value: 'pingguoyuan',
                                    label: '苹果园',
                                },
                            ],
                        },
                        {
                            value: 'haidian',
                            label: '海淀区',
                            children: [
                                {
                                    value: 'zhongguancun',
                                    label: '中关村',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        props: [
            ...commonProps,
            showSearch(true),
            allowClear(true),
        ],
    },
    FormSwitch: {
        ...commonConfig,
        showTagName: 'Switch',
        title: '开关',
        dependence: '@/library/components',
        description: '开关',
        defaultProps: {
            type: 'switch',
            label: '开关',
            width: '100px',
        },
        props: [
            ...commonProps,
        ],
    },
    FormDate: {
        ...commonConfig,
        showTagName: 'Date',
        title: '日期',
        dependence: '@/library/components',
        description: '日期选择',
        defaultProps: {
            type: 'date',
            label: '日期',
            width: '200px',
        },
        props: [
            ...commonProps,
            allowClear(true),
            {
                name: '显示时间',
                attribute: 'showTime',
                valueType: 'boolean',
                defaultValue: false,
                formType: 'switch',
                checkedChildren: '是',
                unCheckedChildren: '否',
                half: true,
            },
        ],
    },
    FormDateRange: {
        ...commonConfig,
        showTagName: 'DateRange',
        title: '日期区间',
        dependence: '@/library/components',
        description: '日期区间',
        defaultProps: {
            type: 'date-range',
            label: '日期区间',
            width: '300px',
        },
        props: [
            ...commonProps,
            allowClear(true),
            {
                name: '显示时间',
                attribute: 'showTime',
                valueType: 'boolean',
                defaultValue: false,
                formType: 'switch',
                checkedChildren: '是',
                unCheckedChildren: '否',
                half: true,
            },
        ],
    },
    FormMonth: {
        ...commonConfig,
        showTagName: 'Month',
        title: '月份选择',
        dependence: '@/library/components',
        description: '月份选择',
        defaultProps: {
            type: 'month',
            label: '月份选择',
            width: '200px',
        },
        props: [
            ...commonProps,
            allowClear(true),
        ],
    },
    FormTime: {
        ...commonConfig,
        showTagName: 'Time',
        title: '时间选择',
        dependence: '@/library/components',
        description: '时间选择',
        defaultProps: {
            type: 'time',
            label: '时间选择',
            width: '200px',
        },
        props: [
            ...commonProps,
            allowClear(true),
        ],
    },
    FormJson: {
        ...commonConfig,
        showTagName: 'Json',
        title: 'Json编辑器',
        dependence: '@/library/components',
        description: 'Json编辑器',
        defaultProps: {
            type: 'json',
            label: 'Json',
            elementStyle: {height: 100},
        },
        props: [
            ...commonProps,
            allowClear(true),
        ],
    },
    FormTransfer: {
        ...commonConfig,
        showTagName: 'Transfer',
        title: '穿梭框',
        dependence: '@/library/components',
        description: '穿梭框选择器',
        defaultProps: {
            type: 'transfer',
            label: '穿梭框',
            dataSource: [
                {key: '1', title: '选项1'},
                {key: '2', title: '选项2'},
                {key: '3', title: '选项2'},
            ],
            titles: ['未选', '已选'],
        },
        props: [
            ...commonProps,
            {
                attribute: 'titles',
                valueType: 'json',
                formType: 'json',
                label: '标题',
                height: '80px',
                defaultValue: [
                    {key: '1', title: '选项1'},
                    {key: '2', title: '选项2'},
                    {key: '3', title: '选项2'},
                ],
                tabSize: 2,
            },
        ],
    },
};
