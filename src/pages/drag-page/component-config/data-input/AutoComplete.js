export default {
    isFormElement: true,
    isContainer: false,
    actions: {
        onSearch: value => args => {
            const {
                // pageConfig,
                dragPageAction,
                node,
            } = args;
            if (!node.props) node.props = {};

            if (node?.props?.__options?.length !== node.props.options?.length) {

                node.props.__options = node.props.options.map(item => ({...item}));
            }
            node.props.options = node.props.__options.map(item => {

                return {value: `${value}${item.value}`};
            });

            dragPageAction.render();
        },
    },

    fields: [
        {label: '支持清除', category: '选项', field: 'allowClear', type: 'boolean', defaultValue: false, version: '', desc: '支持清除'},
        {label: '是否禁用', category: '选项', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '是否禁用'},
        {label: '自动焦点', category: '选项', field: 'autoFocus', type: 'boolean', defaultValue: false, version: '', desc: '自动获取焦点'},
        {label: '输入框提示', field: 'placeholder', type: 'string', version: '', desc: '输入框提示'},
        {label: '下拉选项', field: 'options', type: 'options', withLabel: false, version: '', desc: '数据化配置选项内容，相比 jsx 定义会获得更好的渲染性能'},
        /*
            {label: '使用键盘选择选项的时候把选中项回填到输入框中', field: 'backfill', type: 'boolean', defaultValue: false, version: '', desc: '使用键盘选择选项的时候把选中项回填到输入框中'},
            {
                label: '自动完成的数据源',
                field: 'children (自动完成的数据源)',
                type: 'enum',
                version: '',
                options: [{value: 'React.ReactElement<OptionProps>', label: 'React.ReactElement<OptionProps>'}, {value: 'Array<React.ReactElement<OptionProps>>', label: 'Array<React.ReactElement<OptionProps>>'}],
                desc: '自动完成的数据源',
            },
            {
                label: '自定义输入框',
                field: 'children (自定义输入框)',
                type: 'enum',
                defaultValue: '<Input />',
                version: '',
                options: [{value: 'HTMLInputElement', label: 'HTMLInputElement'}, {value: 'HTMLTextAreaElement', label: 'HTMLTextAreaElement'}, {value: 'React.ReactElement<InputProps>', label: 'React.ReactElement<InputProps>'}],
                desc: '自定义输入框',
            },
            {label: '是否默认高亮第一个选项', field: 'defaultActiveFirstOption', type: 'boolean', defaultValue: true, version: '', desc: '是否默认高亮第一个选项'},
            {label: '是否默认展开下拉菜单', field: 'defaultOpen', type: 'boolean', version: '', desc: '是否默认展开下拉菜单'},
            {label: '指定默认选中的条目', field: 'defaultValue', type: 'string', version: '', desc: '指定默认选中的条目'},
            {label: '下拉菜单的 className 属性', field: 'dropdownClassName', type: 'string', version: '', desc: '下拉菜单的 className 属性'},
            {
                label: '下拉菜单和选择器同宽。默认将设置 min-width，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动',
                field: 'dropdownMatchSelectWidth',
                type: 'enum',
                defaultValue: 'true',
                version: '',
                options: [{value: 'boolean', label: 'boolean'}, {value: 'number', label: 'number'}],
                desc: '下拉菜单和选择器同宽。默认将设置 min-width，当值小于选择框宽度时会被忽略。false 时会关闭虚拟滚动',
            },
            {
                label: '是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false',
                field: 'filterOption',
                type: 'enum',
                defaultValue: 'true',
                version: '',
                options: [{value: 'boolean', label: 'boolean'}, {value: 'function(inputValue, option)', label: 'function(inputValue, option)'}],
                desc: '是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false',
            },
            {
                label: '菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。示例',
                field: 'getPopupContainer',
                type: 'function(triggerNode)',
                defaultValue: '() => document.body',
                version: '',
                desc: '菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。示例',
            },
            {label: '当下拉列表为空时显示的内容', field: 'notFoundContent', type: 'ReactNode', version: '', desc: '当下拉列表为空时显示的内容'},
            {label: '是否展开下拉菜单', field: 'open', type: 'boolean', version: '', desc: '是否展开下拉菜单'},

            {label: '指定当前选中的条目', field: 'value', type: 'string', version: '', desc: '指定当前选中的条目'},
            {label: '失去焦点时的回调', field: 'onBlur', type: 'function()', version: '', desc: '失去焦点时的回调'},
            {label: '选中 option，或 input 的 value 变化时，调用此函数', field: 'onChange', type: 'function(value)', version: '', desc: '选中 option，或 input 的 value 变化时，调用此函数'},
            {label: '展开下拉菜单的回调', field: 'onDropdownVisibleChange', type: 'function(open)', version: '', desc: '展开下拉菜单的回调'},
            {label: '获得焦点时的回调', field: 'onFocus', type: 'function()', version: '', desc: '获得焦点时的回调'},
            {label: '搜索补全项的时候调用', field: 'onSearch', type: 'function(value)', version: '', desc: '搜索补全项的时候调用'},
            {label: '被选中时调用，参数为选中项的 value 值', field: 'onSelect', type: 'function(value, option)', version: '', desc: '被选中时调用，参数为选中项的 value 值'},
            */
    ],
};
