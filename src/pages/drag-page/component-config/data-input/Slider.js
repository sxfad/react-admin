import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    isFormElement: true,
    isContainer: false,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [
        {label: '可清除', category: '选项', field: 'allowClear', type: 'boolean', defaultValue: false, version: '', desc: '支持清除, 单选模式有效'},
        {label: '禁用', category: '选项', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '值为 true 时，滑块为禁用状态'},
        {label: '反向坐标轴', category: '选项', field: 'reverse', type: 'boolean', defaultValue: false, version: '', desc: '反向坐标轴'},
        {label: '刻度', category: '选项', field: 'dots', type: 'boolean', defaultValue: false, version: '', desc: '是否只能拖拽到刻度上'},
        // {label: '包含关系', appendField: 'marks', field: 'included', type: 'boolean', defaultValue: true, version: '', desc: 'marks 不为空对象时有效，值为 true 时表示值为包含关系，false 表示并列'},
        {label: '最小值', field: 'min', type: 'number', defaultValue: 0, version: '', desc: '最小值'},
        {label: '最大值', field: 'max', type: 'number', defaultValue: 100, version: '', desc: '最大值'},
        {
            label: '步长',
            field: 'step',
            type: 'number',
            defaultValue: 1,
            version: '',
            desc: '步长，取值必须大于 0，并且可被 (max - min) 整除。当 marks 不为空对象时，可以设置 step 为 null，此时 Slider 的可选值仅有 marks 标出来的部分',
        },
        {label: '垂直方向', field: 'vertical', type: 'boolean', defaultValue: false, version: '', desc: '值为 true 时，Slider 为垂直方向'},
        {label: '始终提示', field: 'tooltipVisible', type: 'boolean', version: '', desc: '值为 true 时，Tooltip 将会始终显示；否则始终不显示，哪怕在拖拽及移入时'},
        {label: '提示位置', field: 'tooltipPlacement', type: 'placement', version: '', desc: '设置 Tooltip 展示位置。参考 Tooltip'},
    ],
};
/*
[
    {label:'支持清除, 单选模式有效',field:'allowClear',type:'boolean',defaultValue:false,version:'',desc:'支持清除, 单选模式有效'},
    {label:'设置初始取值。当 range 为 false 时，使用 number，否则用 [number, number]',field:'defaultValue',type:'radio-group',defaultValue:'0 | [0, 0]',version:'',options:[{value:'number',label:'number'},{value:'[number, number]',label:'[number, number]'}],desc:'设置初始取值。当 range 为 false 时，使用 number，否则用 [number, number]'},
    {label:'值为 true 时，滑块为禁用状态',field:'disabled',type:'boolean',defaultValue:false,version:'',desc:'值为 true 时，滑块为禁用状态'},
    {label:'是否只能拖拽到刻度上',field:'dots',type:'boolean',defaultValue:false,version:'',desc:'是否只能拖拽到刻度上'},
    {label:'Tooltip 渲染父节点，默认渲染到 body 上',field:'getTooltipPopupContainer',type:'(triggerNode) => HTMLElement',defaultValue:'() => document.body',version:'',desc:'Tooltip 渲染父节点，默认渲染到 body 上'},
    {label:'marks 不为空对象时有效，值为 true 时表示值为包含关系，false 表示并列',field:'included',type:'boolean',defaultValue:true,version:'',desc:'marks 不为空对象时有效，值为 true 时表示值为包含关系，false 表示并列'},
    {label:'刻度标记，key 的类型必须为 number 且取值在闭区间 [min, max] 内，每个标签可以单独设置样式',field:'marks',type:'object',defaultValue:'{ number: ReactNode } or { number: { style: CSSProperties, label: ReactNode } }',version:'',desc:'刻度标记，key 的类型必须为 number 且取值在闭区间 [min, max] 内，每个标签可以单独设置样式'},
    {label:'最大值',field:'max',type:'number',defaultValue:'100',version:'',desc:'最大值'},
    {label:'最小值',field:'min',type:'number',defaultValue:'0',version:'',desc:'最小值'},
    {label:'双滑块模式',field:'range',type:'radio-group',defaultValue:'false',version:'',options:[{value:'boolean',label:'boolean'},{value:'range',label:'range'}],desc:'双滑块模式'},
    {label:'反向坐标轴',field:'reverse',type:'boolean',defaultValue:false,version:'',desc:'反向坐标轴'},
    {label:'步长，取值必须大于 0，并且可被 (max - min) 整除。当 marks 不为空对象时，可以设置 step 为 null，此时 Slider 的可选值仅有 marks 标出来的部分',field:'step',type:'radio-group',defaultValue:'1',version:'',options:[{value:'number',label:'number'},{value:'null',label:'null'}],desc:'步长，取值必须大于 0，并且可被 (max - min) 整除。当 marks 不为空对象时，可以设置 step 为 null，此时 Slider 的可选值仅有 marks 标出来的部分'},
    {label:'Slider 会把当前值传给 tipFormatter，并在 Tooltip 中显示 tipFormatter 的返回值，若为 null，则隐藏 Tooltip',field:'tipFormatter',type:'radio-group',defaultValue:'IDENTITY',version:'',options:[{value:'value => ReactNode',label:'value => ReactNode'},{value:'null',label:'null'}],desc:'Slider 会把当前值传给 tipFormatter，并在 Tooltip 中显示 tipFormatter 的返回值，若为 null，则隐藏 Tooltip'},
    {label:'设置 Tooltip 展示位置。参考 Tooltip',field:'tooltipPlacement',type:'string',version:'',desc:'设置 Tooltip 展示位置。参考 Tooltip'},
    {label:'值为 true 时，Tooltip 将会始终显示；否则始终不显示，哪怕在拖拽及移入时',field:'tooltipVisible',type:'boolean',version:'',desc:'值为 true 时，Tooltip 将会始终显示；否则始终不显示，哪怕在拖拽及移入时'},
    {label:'设置当前取值。当 range 为 false 时，使用 number，否则用 [number, number]',field:'value',type:'radio-group',version:'',options:[{value:'number',label:'number'},{value:'[number, number]',label:'[number, number]'}],desc:'设置当前取值。当 range 为 false 时，使用 number，否则用 [number, number]'},
    {label:'值为 true 时，Slider 为垂直方向',field:'vertical',type:'boolean',defaultValue:false,version:'',desc:'值为 true 时，Slider 为垂直方向'},
    {label:'与 onmouseup 触发时机一致，把当前值作为参数传入',field:'onAfterChange',type:'(value) => void',version:'',desc:'与 onmouseup 触发时机一致，把当前值作为参数传入'},
    {label:'当 Slider 的值发生改变时，会触发 onChange 事件，并把改变后的值作为参数传入',field:'onChange',type:'(value) => void',version:'',desc:'当 Slider 的值发生改变时，会触发 onChange 事件，并把改变后的值作为参数传入'}
]
* */
