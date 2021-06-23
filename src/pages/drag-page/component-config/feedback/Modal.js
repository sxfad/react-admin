import React from 'react';
import {getNextField} from 'src/pages/drag-page/util';
import {loopNode} from 'src/pages/drag-page/node-util';
import inflection from 'inflection';
// import {buttonTypeOptions} from '../options';

export default {
    editableContents: [
        {
            selector: '.ant-modal-title',
            propsField: 'title',
        },
        {
            selector: '.ant-modal-footer:not(.customer-modal-footer) .ant-btn-primary',
            propsField: 'okText',
        },
        {
            selector: '.ant-modal-footer:not(.customer-modal-footer) .ant-btn:not(.ant-btn-primary)',
            propsField: 'cancelText',
        },
    ],

    // draggable: false,
    componentDisplayName: ({node}) => {
        const {componentName, props = {}} = node;
        const {title} = props;

        if (!title) return componentName;

        return (
            <>
                {componentName}
                <span style={{marginLeft: 4}}>{title}</span>
            </>
        );
    },

    // 需要使用的state数据
    state: (options) => {
        const {state, node} = options;

        if (!node.props) node.props = {};

        const propsField = 'visible';

        const field = getNextField(state, propsField);

        // 首字母大写
        const Field = inflection.camelize(field);

        node.props.visible = `state.${field}`;

        // 关联给其他组件使用的
        node.propsToSet = {
            onClick: `() => state.set${Field}(true)`,
        };

        node.props.onCancel = `() => state.set${Field}(false)`;

        node.state = {
            field,
            fieldValue: false,
            // eslint-disable-next-line
            fieldDesc: 'node => `弹框「${node.props.title}」是否可见`',
            funcField: `set${Field}`,
            funcValue: `${propsField} => state.${field} = ${propsField}`,
        };
    },
    hooks: {
        afterDelete: options => {
            // 弹框删除之后，清除关联节点的onClick
            const {pageConfig} = options;
            const propsToSet = options?.node?.propsToSet;

            if (propsToSet) {
                loopNode(pageConfig, node => {
                    const props = node.props || [];

                    Object.entries(propsToSet)
                        .forEach(([key, value]) => {
                            if (props[key] === value) Reflect.deleteProperty(props, key);
                        });
                });
            }
        },
    },
    fields: [
        // {label: '显示弹框', field: 'visible', type: 'boolean', version: '', desc: '对话框是否可见'},
        {label: '弹框标题', field: 'title', type: 'string', version: '', desc: '标题'},
        {label: '弹框宽度', field: 'width', type: 'unit', defaultValue: 520, version: '', desc: '宽度'},
        {label: '展示遮罩', category: '选项', field: 'mask', type: 'boolean', defaultValue: true, version: '', desc: '是否展示遮罩'},
        {label: '遮罩可关闭', category: '选项', field: 'maskClosable', type: 'boolean', defaultValue: true, version: '', desc: '点击蒙层是否允许关闭'},
        {label: 'esc关闭', category: '选项', field: 'keyboard', type: 'boolean', defaultValue: true, version: '', desc: '是否支持键盘 esc 关闭'},
        {label: '垂直居中', category: '选项', field: 'centered', type: 'boolean', defaultValue: false, version: '', desc: '垂直居中展示 Modal'},
        {label: '展示默认底部', field: 'footer', type: 'FooterSwitch', version: '', desc: '底部内容，当不需要默认底部按钮时，可以设为 footer={null}'},
        {label: '确认按钮文字', field: 'okText', appendField: {footer: undefined}, type: 'string', defaultValue: '确定', version: '', desc: '确认按钮文字'},
        // {label: '确认按钮类型', field: 'okType', appendField: {footer: undefined}, type: 'radio-group', options: buttonTypeOptions, defaultValue: 'primary', version: '', desc: '确认按钮类型'},
        {label: '确定loading', field: 'confirmLoading', appendField: {footer: undefined}, type: 'boolean', defaultValue: false, version: '', desc: '确定按钮 loading'},
        {label: '取消按钮文字', field: 'cancelText', appendField: {footer: undefined}, type: 'string', defaultValue: '取消', version: '', desc: '取消按钮文字'},
        {label: 'z-index', field: 'zIndex', type: 'number', defaultValue: 1000, version: '', desc: '设置 Modal 的 z-index'},
        /*
        {label: 'Modal 完全关闭后的回调', field: 'afterClose', type: 'function', version: '', desc: 'Modal 完全关闭后的回调'},
        {label: 'Modal body 样式', field: 'bodyStyle', type: 'CSSProperties', defaultValue: '', version: '', desc: 'Modal body 样式'},
        {label: 'cancel 按钮 props', field: 'cancelButtonProps', type: 'ButtonProps', version: '', desc: 'cancel 按钮 props'},
        {label: '是否显示右上角的关闭按钮', field: 'closable', type: 'boolean', defaultValue: true, version: '', desc: '是否显示右上角的关闭按钮'},
        {label: '自定义关闭图标', field: 'closeIcon', type: 'ReactNode', defaultValue: '<CloseOutlined />', version: '', desc: '自定义关闭图标'},
        {label: '关闭时销毁 Modal 里的子元素', field: 'destroyOnClose', type: 'boolean', defaultValue: false, version: '', desc: '关闭时销毁 Modal 里的子元素'},
        {label: '对话框关闭后是否需要聚焦触发元素', field: 'focusTriggerAfterClose', type: 'boolean', defaultValue: true, version: '4.9.0', desc: '对话框关闭后是否需要聚焦触发元素'},

        {label: '强制渲染 Modal', field: 'forceRender', type: 'boolean', defaultValue: false, version: '', desc: '强制渲染 Modal'},
        {
            label: '指定 Modal 挂载的 HTML 节点, false 为挂载在当前 dom',
            field: 'getContainer',
            type: 'enum',
            defaultValue: 'document.body',
            version: '',
            options: [{value: 'HTMLElement', label: 'HTMLElement'}, {value: '() => HTMLElement', label: '() => HTMLElement'}, {value: 'Selectors', label: 'Selectors'}, {value: 'false', label: 'false'}],
            desc: '指定 Modal 挂载的 HTML 节点, false 为挂载在当前 dom',
        },


        {label: '遮罩样式', field: 'maskStyle', type: 'CSSProperties', defaultValue: '', version: '', desc: '遮罩样式'},
        {label: '自定义渲染对话框', field: 'modalRender', type: '(node: ReactNode) => ReactNode', version: '4.7.0', desc: '自定义渲染对话框'},
        {label: 'ok 按钮 props', field: 'okButtonProps', type: 'ButtonProps', version: '', desc: 'ok 按钮 props'},
        {label: '可用于设置浮层的样式，调整浮层位置等', field: 'style', type: 'CSSProperties', version: '', desc: '可用于设置浮层的样式，调整浮层位置等'},
        {label: '对话框外层容器的类名', field: 'wrapClassName', type: 'string', version: '', desc: '对话框外层容器的类名'},
        {label: '点击遮罩层或右上角叉或取消按钮的回调', field: 'onCancel', type: 'function(e)', version: '', desc: '点击遮罩层或右上角叉或取消按钮的回调'},
        {label: '点击确定回调', field: 'onOk', type: 'function(e)', version: '', desc: '点击确定回调'},
        */
    ],
};
