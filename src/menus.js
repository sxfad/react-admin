/*
* 菜单数据 返回Promise各式，支持前端硬编码、异步获取菜单数据
* */
export default function getMenus(userId) {
    // TODO 根据userId获取菜单数据 或在此文件中前端硬编码菜单
    return Promise.resolve([
        {key: '1', text: '用户管理', icon: 'user'},
        {key: '1-1', parentKey: '1', path: '/users', text: '用户列表', icon: 'align-left', order: 100},
        {key: '1-2', parentKey: '1', text: 'level-1-2', icon: 'align-left'},
        {key: '1-3', parentKey: '1', text: 'level-1-3', icon: 'align-left'},
        {key: '1-4', parentKey: '1', text: 'level-1-4', icon: 'align-left'},
        {key: '1-4-1', parentKey: '1-4', text: 'level-1-4-1', icon: 'align-left'},
        {key: '1-4-2', parentKey: '1-4', text: 'level-1-4-2', icon: 'align-left'},
        {key: '1-4-3', parentKey: '1-4', text: 'level-1-4-3', icon: 'align-left'},
        {key: '1-4-4', parentKey: '1-4', text: 'level-1-4-4', icon: 'align-left'},
        {key: '1-4-3-1', parentKey: '1-4-3', text: 'level-1-4-3-1', icon: 'align-left'},
        {key: '1-4-3-2', parentKey: '1-4-3', text: 'level-1-4-3-2', icon: 'align-left'},
        {key: '1-4-3-3', parentKey: '1-4-3', text: 'level-1-4-3-3', icon: 'align-left'},
        {key: '1-4-3-4', parentKey: '1-4-3', text: 'level-1-4-3-4', icon: 'align-left'},

        {key: 'antDesign', text: 'Ant Design 官网', icon: 'ant-design', url: 'https://ant-design.gitee.io', target: '', order: 2000},
        {key: 'google', text: '谷歌', icon: 'google', url: 'https://www.google.com', target: '_blank', order: 1200},
        {key: 'document', text: '文档', icon: 'book', url: 'https://open.vbill.cn/react-admin', target: '_blank', order: 1200},

        {key: 'menus', text: '菜单编辑', icon: 'lock', path: '/menu-permission', order: 1000},
        {key: 'ajax', text: 'ajax请求', icon: 'api', path: '/example/ajax', order: 998},
        // {key: 'user', text: '用户列表', icon: 'user', path: '/users', order: 900},
        {key: 'role', text: '角色列表 ', icon: 'team', path: '/roles', order: 800},
        {key: 'page404', text: '404页面不存', icon: 'file-search', path: '/404', order: 700},
        {key: 'user-center', text: '用户中心', icon: 'user', path: '/user-center', order: 600},
        {key: 'component', text: '组件', icon: 'ant-design', order: 700},
    ]);
}
