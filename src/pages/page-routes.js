// 此文件内容会通过 config/route-loader.js 进行处理
// 当前文件内容只是示例，无效，loader会进行覆盖

// 不需要导航框架的页面路径
export const noFrames = [
    '/login',
];

// 不需要登录就可以访问的页面路径
export const noAuths = [
    '/login',
];

// 需要keep alive 页面
export const keepAlives = [
    {
        path: '/login',
        keepAlive: false,
    },
];

// 页面路由配置
export default [
    {
        path: '/',
        component: () => import('./home/index.jsx'),
    },
    {
        path: '/iframe_page_/:src',
        component: () => import('./iframe/index.jsx'),
    },
    {
        path: '/login',
        component: () => import('./login/index.jsx'),
    },
];
