import {findParentNodeByName} from '@/pages/drag-page/node-util';

export default {
    isContainer: true,
    dropInTo: options => {
        const {targetNode, pageConfig} = options;
        if (targetNode?.componentName === 'Menu') return true;

        let menuNode = findParentNodeByName(pageConfig, 'Menu', targetNode.id);

        return !!menuNode;
    },
    fields: [
        {label: '展示错误状态样式', field: 'danger', type: 'boolean', defaultValue: false, version: '4.3.0', desc: '展示错误状态样式'},
        {label: '是否禁用', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '是否禁用'},
        {label: '菜单图标', field: 'icon', type: 'ReactNode', version: '4.2.0', desc: '菜单图标'},
        {label: 'key', field: 'key', type: 'string', version: '', desc: 'item 的唯一标志'},
        {label: '标题', field: 'title', type: 'string', version: '', desc: '设置收缩时展示的悬浮标题'},
    ],
};

/*
[
    {label:'展示错误状态样式',field:'danger',type:'boolean',defaultValue:false,version:'4.3.0',desc:'展示错误状态样式'},
    {label:'是否禁用',field:'disabled',type:'boolean',defaultValue:false,version:'',desc:'是否禁用'},
    {label:'菜单图标',field:'icon',type:'ReactNode',version:'4.2.0',desc:'菜单图标'},
    {label:'item 的唯一标志',field:'key',type:'string',version:'',desc:'item 的唯一标志'},
    {label:'设置收缩时展示的悬浮标题',field:'title',type:'string',version:'',desc:'设置收缩时展示的悬浮标题'}
]
* */
