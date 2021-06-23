export default {
    isWrapper: true,
    freezeIsWrapper: true, // 锁定，不切换
    fields: [
        {label: '顶部部触发偏移量', field: 'offsetTop', type: 'number', version: '', desc: '距离窗口顶部达到指定偏移量后触发'},
        {label: '底部触发偏移量', field: 'offsetBottom', type: 'number', version: '', desc: '距离窗口底部达到指定偏移量后触发'},
    ],
};

/*
offsetBottom	距离窗口底部达到指定偏移量后触发	number	-
offsetTop	距离窗口顶部达到指定偏移量后触发	number	-
target	设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数	() => HTMLElement	() => window
onChange	固定状态改变时触发的回调函数	function(affixed)	-
* */
