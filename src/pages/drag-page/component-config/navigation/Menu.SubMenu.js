import {findParentNodeByName} from 'src/pages/drag-page/node-util';

export default {
    isContainer: true,
    dropInTo: options => {
        const {targetNode, pageConfig} = options;
        if (targetNode?.componentName === 'Menu') return true;

        let menuNode = findParentNodeByName(pageConfig, 'Menu', targetNode.id);

        return !!menuNode;
    },
    fields: [
        {label: '是否禁用', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '是否禁用'},
        {label: '菜单图标', field: 'icon', type: 'ReactNode', version: '4.2.0', desc: '菜单图标'},
        {label: 'key', field: 'key', type: 'string', version: '', desc: '唯一标志'},
        {label: '标题', field: 'title', type: 'ReactNode', version: '', desc: '子菜单项值'},
    ],
};
/*
[
    {label:'子菜单的菜单项',field:'children',type:'radio-group',version:'',options:[{value:'Array<MenuItem',label:'Array<MenuItem'},{value:'SubMenu>',label:'SubMenu>'}],desc:'子菜单的菜单项'},
    {label:'是否禁用',field:'disabled',type:'boolean',defaultValue:false,version:'',desc:'是否禁用'},
    {label:'菜单图标',field:'icon',type:'ReactNode',version:'4.2.0',desc:'菜单图标'},
    {label:'唯一标志',field:'key',type:'string',version:'',desc:'唯一标志'},
    {label:'子菜单样式，mode=\\'inline\\' 时无效',field:'popupClassName',type:'string',version:'',desc:'子菜单样式，mode=\\'inline\\' 时无效'},
    {label:'子菜单偏移量，mode=\\'inline\\' 时无效',field:'popupOffset',type:'[number, number]',version:'',desc:'子菜单偏移量，mode=\\'inline\\' 时无效'},
    {label:'子菜单项值',field:'title',type:'ReactNode',version:'',desc:'子菜单项值'},
    {label:'点击子菜单标题',field:'onTitleClick',type:'function({ key, domEvent })',version:'',desc:'点击子菜单标题'}
]
* */
