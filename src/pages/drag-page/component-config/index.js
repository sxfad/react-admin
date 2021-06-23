import React from 'react';
import {AppstoreOutlined} from '@ant-design/icons';
import NodeRender from '../iframe-render/node-render/NodeRender';
import {loopNode} from '../node-util';
import Icons from './icon';

const result = {
    ...Icons,
};
const req = require.context('./', true, /\.js$/);

req.keys().forEach(key => {
    if ([
        './options.js',
        './index.js',
        './icon.js',
    ].includes(key)) return;

    const model = req(key);
    const keys = key.split('/');
    let fileName = keys.pop().replace('.js', '');

    result[fileName] = model.default;
});

export const defaultConfig = {
    // editableContents: [ // 可编辑内容
    //     {
    //         selector: '.ant-modal-title', // string || function  基于当前元素的选择器，缺省标识当前节点
    //         propsField: 'title', // 要修改的props属性
    //          onClick: event => options => {},
    //          onInput: event => options => { // 输入事件
    //              const {node, pageConfig, dragPageAction} = options;
    //              const value = event.target.innerText;
    //
    //              if (!node.props) node.props = {};
    //              node.props.title = value;
    //
    //          },
    //          onBlur: event => options => { // 失去焦点事件
    //              const {node, pageConfig, dragPageAction} = options;
    //              const value = event.target.innerText;
    //
    //              if (!node.props) node.props = {};
    //              node.props.title = value;
    //
    //          },
    //
    //
    //     },
    // ],
    render: true, // 是否渲染，默认 true
    icon: <AppstoreOutlined/>, // 组件图标
    // isFormElement: undefined, // 是否是表单组件，如果是，可以放入 Form.Item中
    // renderComponentName: '', // 指定渲染使用组件，比如 PageContent 并不存在，可以指定使用div渲染
    // componentId: undefined, // 渲染时组件id
    // componentDesc: undefined, // 组件描述
    // componentType: undefined, // 组件类型，详见 getComponent方法，默认 drag-page/components -> antd -> html
    // componentDisplayName: '', // 组件展示名称，默认 componentName，string 字符串 || ReactNode 节点 || ({node, pageConfig}) => name 函数返回值
    // renderAsDisplayName: '', // 是否渲染组件，作为componentDisplayName
    draggable: true, // 组件是否可拖拽 默认 true
    isWrapper: false, // 是否是包裹类组件，比如Tooltip、Badge ，包裹其他组件的
    isContainer: true, // 组件是否是容器，默认true，如果是容器，则可托放入子节点
    withDragProps: true, // 不使用dragProps 有些组件dragProps添加的位置不准确或者没有添加上，通过 afterRender修复，这时候可能不需要NodeRender中添加dragProps了

    // dropAccept: undefined, // 'text' || ['Text'] || function({draggingNode, targetNode, pageConfig,}), // 可接受拖入的组件，默认 任意组件都接收
    // dropInto: undefined, // 'text' || ['Text'] || function({draggingNode, targetNode, pageConfig,}), // 可放入的目标组件，默认 可以放入任何组件中
    // 如果某个组件必须存在子元素，可以添加 withHolder: true, 提示用户必须拖入子元素，比如 Form.Item，但是div不要设置true，有些情况div不需要子元素
    withHolder: false, // 当没有子组件的时候，是否显示holder 默认 false ，true && isContainer 显示
    // holderProps: {}, //

    childrenDraggable: true, // 子节点是否可拖拽，
    // actions: { // 事件 event:组件事件原始数据 options: 自定义数据
    //     onSearch: event => options => {
    //
    //         const {
    //             pageConfig, // 页面整体配置
    //             dragPageAction, // 页面action
    //             node, // 当前组件配置
    //         } = options;
    //         if (!node.props) node.props = {};
    //
    //         node.props.options = [
    //             {event: `${event}@qq.com`},
    //             {event: `${event}@163.com`},
    //             {event: `${event}@qiye.com`},
    //         ];
    //
    //         dragPageAction.render(); // props改变了，重新出发页面渲染
    //     },
    // },
    // hooks: {
    // beforeSchemaEdit // scheme 源码编辑之前出发
    // beforeRender // 渲染之前触发，返回false不渲染
    // beforeMove // 返回false， 不允许移动
    // afterMove

    // beforeAdd, // 返回false， 不添加
    // afterAdd,

    // beforeDelete,  // 返回false，不删除
    // afterDelete,

    // beforeAddChildren // 返回false，不允许添加
    // afterAddChildren

    // beforeDeleteChildren // 返回false，不允许删除
    // afterDeleteChildren
    // },
    // // 组件属性配置信息
    // fields: [
    //     {
    //         label: '', // 名称
    //         field: '', // 字段名
    //         type: '', // 编辑类型
    //         options: [], // 下拉等选项数据
    //         defaultValue: '', // 默认值
    //         version: '', // 版本
    //         desc: '', // 描述
    //         category: '', // 分类成一组的名称
    //         categoryOrder: 2,// 分类排序位置
    //         span: 12, //  Col 属性，用于排版
    //         withLabel: true, // options选项，是否有label列，默认true
    //     },
    // ],
};

export function showFieldByAppend(values, appendField) {
    if (!appendField) return true;

    let isShow;
    if (typeof appendField === 'string') {
        isShow = !!(values[appendField] && values[appendField] !== 0);
    }

    if (typeof appendField === 'object') {
        isShow = Object.entries(appendField).some(([k, v]) => {
            const arrayValue = Array.isArray(v) ? v : [v];
            return arrayValue.includes(values[k]);
        });
    }

    return isShow;
}

// 删除默认属性
export function deleteDefaultProps(component) {
    loopNode(component, node => {
        let {componentName, props} = node;

        if (!props) props = {};
        const propsConfig = getComponentConfig(componentName);
        if (propsConfig) {
            const {fields = []} = propsConfig;
            Object.entries(props)
                .forEach(([key, value]) => {
                    // 值为 空字符串
                    if (value === '') Reflect.deleteProperty(props, key);

                    // 值为 undefined
                    if (value === undefined) Reflect.deleteProperty(props, key);

                    const fieldOptions = fields.find(item => item.field === key);

                    // 与默认值相同
                    if (fieldOptions && fieldOptions.defaultValue === value) {
                        Reflect.deleteProperty(props, key);
                    }

                    // 依赖父级不存在
                    if (fieldOptions && fieldOptions.appendField) {
                        const {appendField} = fieldOptions;

                        const isShow = showFieldByAppend(props, appendField);

                        if (!isShow) {
                            Reflect.deleteProperty(props, key);
                        }
                    }
                });
        }
    });
}

// 获取组件配置
export function getComponentConfig(componentName) {
    const config = result[componentName] || {};

    Object.entries(defaultConfig)
        .forEach(([key, value]) => {
            if (!(key in config)) {
                config[key] = value;
            }
        });

    // 冻结，不允许编辑
    Object.freeze(config);

    return config;
}

// 设置节点的默认值
export function setNodeDefault(root) {
    const nodes = [];
    loopNode(root, node => {
        const config = getComponentConfig(node.componentName);
        if (!('propsToSet' in node) && config.propsToSet) {
            // 无法直接设置，会产生死循环，比如Icon，propsToSet里面还有Icon，有设置，还有。。。。
            // node.propsToSet = config.propsToSet;
            nodes.push([node, {propsToSet: config.propsToSet}]);
        }
    });

    nodes.forEach(([node, props]) => {
        Object.entries(props)
            .forEach(([key, value]) => {
                node[key] = value;
            });
    });
}

// 获取组件展示名称
export function getComponentDisplayName(node, render) {
    if (!node || typeof node !== 'object' || Array.isArray(node)) return '';

    const {componentName} = node;
    const config = getComponentConfig(componentName);
    const {componentDisplayName, renderAsDisplayName} = config;

    if (render && renderAsDisplayName) {
        return (
            <div style={{display: 'inline-block', maxWidth: 200}}>
                <NodeRender config={node}/>
            </div>
        );
    }

    let name = componentDisplayName || componentName;

    if (typeof name === 'function') name = name({node});

    return name;
}

export default result;


