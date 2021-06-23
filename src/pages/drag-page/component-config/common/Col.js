import {isMac} from 'src/pages/drag-page/util';

export const colFields = [
    {label: '弹性布局', field: 'flex', type: 'unit', placeholder: 'flex 比如 1 或 100px', version: '', desc: 'flex 布局属性'},
    {label: '占位格数', field: 'span', type: 'number', version: '', desc: '栅格占位格数，为 0 时相当于 display: none'},
    {label: '左间隔数', span: 12, field: 'offset', type: 'number', defaultValue: 0, version: '', desc: '栅格左侧的间隔格数，间隔内不可以有栅格'},
    {label: '栅格顺序', span: 12, labelWidth: '80px', field: 'order', type: 'number', defaultValue: 0, version: '', desc: '栅格顺序'},
    {label: '左移格数', span: 12, field: 'pull', type: 'number', defaultValue: 0, version: '', desc: '栅格向左移动格数'},
    {label: '右移格数', span: 12, labelWidth: '80px', field: 'push', type: 'number', defaultValue: 0, version: '', desc: '栅格向右移动格数'},
];

const screenType = (field) => [
    {value: 'number', label: '占位格数'},
    {
        value: 'object', label: '详细配置',
        fields: colFields.filter(item => item.field !== 'flex').map(item => {

            return {
                ...item,
                onKeyDown: getOnKeyDown(value => ({[field]: {[item.field]: value}})),
            };
        }),
    },
];

export function getOnKeyDown(cb, ancestorComponentName = 'Row') {

    return (e, options) => {
        const {metaKey, ctrlKey, key, target: {value}} = e;
        const isEnter = key === 'Enter';
        const {node, dragPageAction} = options;
        if ((metaKey || ctrlKey) && isEnter) {
            // 为纯数字 直接转换为数字
            let nextValue = value;

            if (nextValue && !window.isNaN(nextValue)) {
                nextValue = window.parseFloat(nextValue);
            }

            const props = cb(nextValue);

            dragPageAction.syncOffspringProps({
                node,
                ancestorComponentName,
                props,
            });
        }
    };
}

export default {
    withHolder: true,
    dropInTo: 'Row', // Col 只能放入Row中
    fields: [
        {
            label: '占位格数',
            field: 'span',
            type: 'number',
            version: '',
            desc: '栅格占位格数，为 0 时相当于 display: none',
            placeholder: `span    ${isMac ? '⌘' : 'ctrl'}+Enter 同步所有列`,

        },
        ...(colFields.filter(item => item.field !== 'span')),

        {label: '屏幕 < 576px', field: 'xs', type: screenType('xs'), version: '', desc: '屏幕 < 576px 响应式栅格，可为栅格数或一个包含其他属性的对象'},
        {label: '屏幕 ≥ 576px', field: 'sm', type: screenType('sm'), version: '', desc: '屏幕 ≥ 576px 响应式栅格，可为栅格数或一个包含其他属性的对象'},
        {label: '屏幕 ≥ 768px', field: 'md', type: screenType('md'), version: '', desc: '屏幕 ≥ 768px 响应式栅格，可为栅格数或一个包含其他属性的对象'},
        {label: '屏幕 ≥ 992px', field: 'lg', type: screenType('lg'), version: '', desc: '屏幕 ≥ 992px 响应式栅格，可为栅格数或一个包含其他属性的对象'},
        {label: '屏幕 ≥ 1200px', field: 'xl', type: screenType('xl'), version: '', desc: '屏幕 ≥ 1200px 响应式栅格，可为栅格数或一个包含其他属性的对象'},
        {label: '屏幕 ≥ 1600px', field: 'xxl', type: screenType('xxl'), version: '', desc: '屏幕 ≥ 1600px 响应式栅格，可为栅格数或一个包含其他属性的对象'},
    ].map(item => {
        return {
            ...item,
            onKeyDown: getOnKeyDown(value => ({[item.field]: value})),
        };
    }),
};
