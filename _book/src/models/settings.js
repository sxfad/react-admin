export const PAGE_FRAME_LAYOUT = {
    TOP_SIDE_MENU: 'top-side-menu',
    TOP_MENU: 'top-menu',
    SIDE_MENU: 'side-menu',
};

export default {
    initialState: {
        pageFrameLayout: PAGE_FRAME_LAYOUT.SIDE_MENU,
        pageHeadFixed: true,
        pageHeadShow: true,
        tabsShow: true,
    },

    syncStorage: true, // 全部同步到localStorage中

    setPageFrameLayout: (pageFrameLayout) => ({pageFrameLayout}),
    setPageHeadFixed: (pageHeadFixed) => ({pageHeadFixed: !!pageHeadFixed}),
    showPageHead: (pageHeadShow, state) => ({pageHeadShow: !!pageHeadShow, pageHeadFixed: pageHeadShow ? state.pageHeadFixed : false}),
    showTabs: tabsShow => ({tabsShow}),
}
