export default {
    initialState: {
        breadcrumbs: [],    // 面包屑数据 [{key, text, path}]
        title: '',          // 页面title {text, icon}
        showHead: false,     // 是否显示/隐藏页面头部
        loading: false,
        loadingTip: '',
    },

    showHead: () => ({showHead: true}),
    hideHead: () => ({showHead: false}),

    setTitle: (title) => ({title}),

    setBreadcrumbs: (breadcrumbs) => ({breadcrumbs}),
    appendBreadcrumbs: (appendBreadcrumbs, state) => {
        let {breadcrumbs = []} = state;
        breadcrumbs = breadcrumbs.concat(appendBreadcrumbs);
        return {breadcrumbs};
    },

    showLoading: (loadingTip) => ({loading: true, loadingTip}),
    hideLoading: () => ({loading: false, loadingTip: ''}),
}
