export default {
    'get /menus': [
        {id: 'system', title: '系统管理', order: 900},
        {id: 'user', parentId: 'system', title: '用户管理', path: '/users', order: 900},
        {id: 'role', parentId: 'system', title: '角色管理', path: '/roles', order: 900},
        {id: 'menu', parentId: 'system', title: '菜单管理', path: '/menus', order: 900},
        {id: 'demo', title: '实例', basePath: '/demo', order: 850},
        {id: 'layout', parentId: 'demo', title: '布局', path: '/layout', order: 900},
        {id: 'modal', parentId: 'demo', title: '弹框', path: '/modal', order: 900},
        {id: 'query-bar', parentId: 'demo', title: '查询条件', path: '/query-bar', order: 900},

        {id: 'other-site', title: '第三方网站', order: 800},
        {id: 'baidu', parentId: 'other-site', title: '百度', path: 'https://baidu.com', target: 'iframe', order: 2000},
        {id: 'antDesign', parentId: 'other-site', title: 'Ant Design 官网', path: 'https://ant-design.gitee.io', target: 'iframe', order: 2000},
        {id: 'document', parentId: 'other-site', title: '文档', path: 'http://shubin.wang/docs', target: '_blank', order: 1200},

        {id: 'example', title: '示例', order: 600},
        {id: 'page404', parentId: 'example', title: '404页面不存在', path: '/404', order: 700},
        {id: 'table-editable', parentId: 'example', title: '可编辑表格', path: '/example/table-editable', order: 600},

        {id: 'level', basePath: '/demo', parentId: 'example', title: '多级', order: 500},
        {id: 'level1', parentId: 'level', path: '/1', title: '多级1', order: 500},
        {id: 'level11', parentId: 'level', path: '/2', title: '多级11', order: 500},
        {id: 'level2', parentId: 'level11', path: '/3', title: '多级11', order: 500},

        {id: 'baidu-family', basePath: 'http://baidu.com', title: '百度全家桶', order: 400},
        {id: 'baidu-zhidao', parentId: 'baidu-family', title: '知道'},
        {id: 'baidu-buzhidao', parentId: 'baidu-zhidao', title: '不知道', path: '/buzhidao', target: 'iframe'},
        {id: 'code-key', parentId: 'baidu-family', title: '添加百度用户', type: '2', code: 'ADD_USER', path: '/buzhidaoa', target: 'iframe'},
    ],
    'post /menus': {id: '123'},
    'put /menus': true,
    'delete re:/menus/.+': true,
};
