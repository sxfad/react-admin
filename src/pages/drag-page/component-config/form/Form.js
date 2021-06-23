import {v4 as uuid} from 'uuid';
import {colFields} from '../common/Col';

export default {
    hooks: {
        beforeRender: options => {
            const {node} = options;
            if (!node.props) node.props = {};
            node.props.name = `formName_${uuid()}`;
        },
    },
    fields: [
        {label: '显示冒号', category: '选项', field: 'colon', type: 'boolean', defaultValue: true, version: '', desc: '配置 Form.Item 的 colon 的默认值。表示是否显示 label 后面的冒号 (只有在属性 layout 为 horizontal 时有效)'},
        {
            label: '必选样式',
            category: '选项',
            field: 'requiredMark',
            type: 'boolean',
            defaultValue: true,
            version: '4.6.0',
            desc: '必选样式，可以切换为必选或者可选展示样式。此为 Form 配置，Form.Item 无法单独配置',
        },
        {
            label: '表单布局',
            field: 'layout',
            type: 'radio-group',
            defaultValue: 'horizontal',
            version: '',
            options: [{value: 'horizontal', label: '水平'}, {value: 'vertical', label: '垂直'}, {value: 'inline', label: '内联'}],
            desc: '表单布局',
        },
        {
            label: '组件尺寸', field: 'size', type: 'radio-group', version: '',
            options: [
                {value: 'large', label: '大号'},
                {value: 'middle', label: '中号'},
                {value: 'small', label: '小号'},
            ],
            desc: '设置字段组件的尺寸（仅限 antd 组件）',
        },
        {
            label: 'label对齐方式', field: 'labelAlign', type: 'radio-group', defaultValue: 'right', version: '',
            options: [{value: 'left', label: '左对齐'}, {value: 'right', label: '右对齐'}],
            desc: 'label 标签的文本对齐方式',
        },
        {label: '快速编辑表单项', field: '__items', type: 'FormItemFast'},
        {
            label: '标签布局', field: 'labelCol',
            type: {
                value: 'object',
                fields: colFields,
            },
            version: '',
            desc: 'label 标签布局，同 Col 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12}',
        },
        {
            label: '控件布局', field: 'wrapperCol',
            type: {
                value: 'object',
                fields: colFields,
            },
            version: '',
            desc: '需要为输入控件设置布局样式时，使用该属性，用法同 labelCol',
        },
    ],
};

/*
[
    {label:'配置 Form.Item 的 colon 的默认值。表示是否显示 label 后面的冒号 (只有在属性 layout 为 horizontal 时有效)',field:'colon',type:'boolean',defaultValue:true,version:'',desc:'配置 Form.Item 的 colon 的默认值。表示是否显示 label 后面的冒号 (只有在属性 layout 为 horizontal 时有效)'},
    {label:'设置 Form 渲染元素，为 false 则不创建 DOM 节点',field:'component',type:'enum',defaultValue:'form',version:'',options:[{value:'ComponentType',label:'ComponentType'},{value:'false',label:'false'}],desc:'设置 Form 渲染元素，为 false 则不创建 DOM 节点'},
    {label:'通过状态管理（如 redux）控制表单字段，如非强需求不推荐使用。查看示例',field:'fields',type:'FieldData[]',version:'',desc:'通过状态管理（如 redux）控制表单字段，如非强需求不推荐使用。查看示例'},
    {label:'经 Form.useForm() 创建的 form 控制实例，不提供时会自动创建',field:'form',type:'FormInstance',version:'',desc:'经 Form.useForm() 创建的 form 控制实例，不提供时会自动创建'},
    {label:'表单默认值，只有初始化以及重置时生效',field:'initialValues',type:'object',version:'',desc:'表单默认值，只有初始化以及重置时生效'},
    {label:'label 标签的文本对齐方式',field:'labelAlign',type:'enum',defaultValue:'right',version:'',options:[{value:'left',label:'left'},{value:'right',label:'right'}],desc:'label 标签的文本对齐方式'},
    {label:'label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12}',field:'labelCol',type:'object',version:'',desc:'label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12}'},
    {label:'表单布局',field:'layout',type:'enum',defaultValue:'horizontal',version:'',options:[{value:'horizontal',label:'horizontal'},{value:'vertical',label:'vertical'},{value:'inline',label:'inline'}],desc:'表单布局'},
    {label:'表单名称，会作为表单字段 id 前缀使用',field:'name',type:'string',version:'',desc:'表单名称，会作为表单字段 id 前缀使用'},
    {label:'当字段被删除时保留字段值',field:'preserve',type:'boolean',defaultValue:true,version:'4.4.0',desc:'当字段被删除时保留字段值'},
    {label:'必选样式，可以切换为必选或者可选展示样式。此为 Form 配置，Form.Item 无法单独配置',field:'requiredMark',type:'enum',defaultValue:'true',version:'4.6.0',options:[{value:'boolean',label:'boolean'},{value:'optional',label:'optional'}],desc:'必选样式，可以切换为必选或者可选展示样式。此为 Form 配置，Form.Item 无法单独配置'},
    {label:'提交失败自动滚动到第一个错误字段',field:'scrollToFirstError',type:'enum',defaultValue:'false',version:'',options:[{value:'boolean',label:'boolean'},{value:'Options',label:'Options'}],desc:'提交失败自动滚动到第一个错误字段'},
    {label:'设置字段组件的尺寸（仅限 antd 组件）',field:'size',type:'enum',version:'',options:[{value:'small',label:'small'},{value:'middle',label:'middle'},{value:'large',label:'large'}],desc:'设置字段组件的尺寸（仅限 antd 组件）'},
    {label:'验证提示模板，说明见下',field:'validateMessages',type:'ValidateMessages',version:'',desc:'验证提示模板，说明见下'},
    {label:'统一设置字段校验规则',field:'validateTrigger',type:'enum',defaultValue:'onChange',version:'4.3.0',options:[{value:'string',label:'string'},{value:'string[]',label:'string[]'}],desc:'统一设置字段校验规则'},
    {label:'需要为输入控件设置布局样式时，使用该属性，用法同 labelCol',field:'wrapperCol',type:'object',version:'',desc:'需要为输入控件设置布局样式时，使用该属性，用法同 labelCol'},
    {label:'字段更新时触发回调事件',field:'onFieldsChange',type:'function(changedFields, allFields)',version:'',desc:'字段更新时触发回调事件'},
    {label:'提交表单且数据验证成功后回调事件',field:'onFinish',type:'function(values)',version:'',desc:'提交表单且数据验证成功后回调事件'},
    {label:'提交表单且数据验证失败后回调事件',field:'onFinishFailed',type:'function({ values, errorFields, outOfDate })',version:'',desc:'提交表单且数据验证失败后回调事件'},
    {label:'字段值更新时触发回调事件',field:'onValuesChange',type:'function(changedValues, allValues)',version:'',desc:'字段值更新时触发回调事件'}
]
* */
