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
        {label: '分组标题', field: 'title', type: 'ReactNode', version: '', desc: '分组标题'},
    ],
};

/*
[
    {label:'分组的菜单项',field:'children',type:'MenuItem[]',version:'',desc:'分组的菜单项'},
    {label:'分组标题',field:'title',type:'ReactNode',version:'',desc:'分组标题'}
]
* */
