/**
 * 当前文件会由config-loader处理，编辑无效
 * 返回示例如下：
 * */
export default [
    {
        path: '/users', // 路由地址
        component: () => import('/../src/pages/home/user/index.jsx'),
        filePath: '/../src/pages/home/user/index.jsx', // 文件绝对路径
        // ... 其他config高级组件参数
    },
];
