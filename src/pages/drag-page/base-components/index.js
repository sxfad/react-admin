import {v4 as uuid} from 'uuid';
import base from './base';
import navigation from './navigation';
import common from './common';
import form from './form';
import dataInput from './data-input';
import dataShow from './data-show';
import feedback from './feedback';
import other from './other';
import icon from './icon';
import baseModule from './module';
import {getComponentConfig, setNodeDefault} from 'src/pages/drag-page/component-config';

const defaultConfig = {
    // title: '页面容器', // 组件
    // icon: '', // false标识不显示 组件库中显示的icon，默认为 config icon
    // hiddenInStore: false, // 组件库中不显示
    // image: '', // 预览图片
    renderPreview: true, // 直接渲染 config配置
    // renderPreview: <div>直接jsx</div>,
    // renderPreview: config => <div>函数返回jsx</div>,
    previewProps: {}, // 预览时属性
    // previewZoom: .5, // 预览缩放
    // previewStyle: {width: '100%'}, // 预览组件样式
    // previewWrapperStyle: {}, // 预览容器样式
};

export default [
    {title: '默认', children: base},
    {title: '通用', children: common},
    {title: '导航', children: navigation},
    {title: '常用模块', children: baseModule},
    {title: '表单', children: form},
    {title: '数据输入', children: dataInput},
    {title: '数据展示', children: dataShow},
    {title: '反馈', children: feedback},
    {title: '其他', children: other},
    {title: '图标', children: icon},
].map(item => {
    item.id = uuid();
    item.children = setDefaultOptions(item.children);
    return item;
});

// 组件库 设置默认值
export function setDefaultOptions(nodes) {
    if (!nodes?.length) return nodes;

    nodes.forEach(node => {
        if (!node.id) node.id = uuid();

        (node?.children || []).forEach(item => {
            if (!item.id) item.id = uuid();

            Object.entries(defaultConfig)
                .forEach(([key, value]) => {
                    if (!(key in item)) item[key] = value;
                });

            const {config} = item;

            if (!item.icon && item.icon !== false) {
                item.icon = getComponentConfig(config.componentName).icon;
            }
            setNodeDefault(config);
        });
    });
    return nodes;
}

