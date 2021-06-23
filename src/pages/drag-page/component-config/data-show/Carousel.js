import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    isContainer: true,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [
        {label: '自动切换', field: 'autoplay', type: 'boolean', defaultValue: false, version: '', desc: '是否自动切换'},
        {
            label: '面板指示点位置', field: 'dotPosition', type: 'radio-group',
            options: [
                {value: 'top', label: '上'},
                {value: 'bottom', label: '下'},
                {value: 'left', label: '左'},
                {value: 'right', label: '右'},
            ],
            defaultValue: 'bottom', version: '', desc: '面板指示点位置，可选 top bottom left right',
        },
    ],
};
/*
[
    {label:'是否自动切换',field:'autoplay',type:'boolean',defaultValue:false,version:'',desc:'是否自动切换'},
    {label:'面板指示点位置，可选 top bottom left right',field:'dotPosition',type:'string',defaultValue:'bottom',version:'',desc:'面板指示点位置，可选 top bottom left right'},
    {label:'是否显示面板指示点，如果为 object 则同时可以指定 dotsClass 或者',field:'dots',type:'radio-group',defaultValue:true,version:'',options:[{value:'boolean',label:'boolean'},{value:'{ className?: string }',label:'{ className?: string }'}],desc:'是否显示面板指示点，如果为 object 则同时可以指定 dotsClass 或者'},
    {label:'动画效果',field:'easing',type:'string',defaultValue:'linear',version:'',desc:'动画效果'},
    {label:'动画效果函数',field:'effect',type:'radio-group',defaultValue:'scrollx',version:'',options:[{value:'scrollx',label:'scrollx'},{value:'fade',label:'fade'}],desc:'动画效果函数'},
    {label:'切换面板的回调',field:'afterChange',type:'function(current)',version:'',desc:'切换面板的回调'},
    {label:'切换面板的回调',field:'beforeChange',type:'function(from, to)',version:'',desc:'切换面板的回调'}
]
* */
