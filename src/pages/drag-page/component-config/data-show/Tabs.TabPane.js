import {fixDragProps} from 'src/pages/drag-page/util';
import {findParentNodeById} from 'src/pages/drag-page/node-util';

export default {
    isContainer: true,
    dropInTo: ['Tabs'],
    withHolder: true,
    withDragProps: false,
    hooks: {
        afterRender: options => {
            const {node, pageConfig, iframeDocument} = options;
            if (!iframeDocument) return;
            const {id} = node;
            const parentNode = findParentNodeById(pageConfig, id);
            const index = parentNode.children.findIndex(item => item.id === id);
            const selectors = `.id_${parentNode.id} > .ant-tabs-content-holder > .ant-tabs-content > .ant-tabs-tabpane`;
            const elements = iframeDocument.querySelectorAll(selectors);
            const ele = elements[index];

            fixDragProps({...options, element: ele});
        },
    },
    fields: [
        {label: '隐藏渲染', field: 'forceRender', type: 'boolean', defaultValue: false, desc: '被隐藏时是否渲染 DOM 结构'},
        {label: 'key', field: 'key', type: 'string', desc: '对应 activeKey'},
        {label: '标签名', field: 'tab', type: 'string', desc: '选项卡头显示文字'},
    ],
};
