// import {ajax} from 'src/commons/ajax';
/*
* 菜单数据 返回Promise各式，支持前端硬编码、异步获取菜单数据
* */
export default function getMenus(userId) {
    // return ajax.get('/menus', {userId}).then(res => {
    //     return (res || []).map(item => ({key: item.id, parentKey: item.parentId, ...item}));
    // });

    // TODO 根据userId获取菜单数据 或在此文件中前端硬编码菜单
    return Promise.resolve([
        { key: 'system', text: '系统管理', icon: 'user', order: 900 },
        { key: 'user', parentKey: 'system', text: '用户管理', icon: 'user', path: '/users', order: 900 },
        { key: 'role', parentKey: 'system', text: '角色管理', icon: 'lock', path: '/roles', order: 900 },
        { key: 'menu', parentKey: 'system', text: '菜单管理', icon: 'align-left', path: '/menus', order: 900 },

        { key: 'other-site', text: '第三方网站', icon: 'ant-design', order: 800 },
        { key: 'antDesign', parentKey: 'other-site', text: 'Ant Design 官网', icon: 'ant-design', url: 'https://ant-design.gitee.io', target: '', order: 2000 },
        { key: 'baidu', parentKey: 'other-site', text: '百度', icon: 'ant-design', url: 'https://baidu.com', target: '', order: 2000 },
        { key: 'document', parentKey: 'other-site', text: '文档', icon: 'book', url: 'http://shubin.wang/docs', target: '_blank', order: 1200 },

        { key: 'example', text: '示例', icon: 'align-left', order: 600 },
        { key: 'page404', parentKey: 'example', text: '404页面不存在', icon: 'file-search', path: '/404', order: 700 },
        { key: 'table-editable', parentKey: 'example', text: '可编辑表格', icon: 'align-left', path: '/example/table-editable', order: 600 },

        { key: 'level', basePath: '/demo', parentKey: 'example', text: '多级', icon: 'align-left', order: 500 },
        { key: 'level1', parentKey: 'level', path: '/1', text: '多级1', icon: 'align-left', order: 500 },
        { key: 'level11', parentKey: 'level', path: '/2', text: '多级11', icon: 'align-left', order: 500 },
        { key: 'level2', parentKey: 'level11', path: '/3', text: '多级11', icon: 'align-left', order: 500 },

        { key: 'baidu', basePath: 'http://baidu.com', text: '百度全家桶', icon: 'DribbbleOutlined', order: 400 },
        { key: 'baidu-zhidao', parentKey: 'baidu', text: '知道', icon: 'align-left', url: '/zhidao' },
        { key: 'baidu-buzhidao', parentKey: 'baidu', text: '不知道', icon: 'align-left', url: '/buzhidao' },
    ]);

}
