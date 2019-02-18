const INIT_WIDTH = 256;

export default {
    initialState: {
        show: true,
        width: INIT_WIDTH,  // 左侧宽度
        collapsedWidth: 80, // 收起时宽度
        collapsed: false,   // 是否展开/收起
        dragging: false,    // 是否正在拖动
    },
    syncStorage: {
        width: true,
        collapsed: true,
    },

    setDragging: (dragging) => ({dragging}),
    hide: () => ({show: false}),
    show: () => ({show: true}),
    setWidth: (width) => ({width}),
    initWidth: () => ({width: INIT_WIDTH}),
    setCollapsed: (collapsed) => ({collapsed}),
}
