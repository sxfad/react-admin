import ajax from 'src/commons/ajax';
import {isLoginPage, formatMenus} from 'src/commons';

export default async function getMenus() {
    const serverMenus = await getServerMenus();
    const menus = serverMenus.filter(item => item.type === 1);

    // 前端硬编码菜单
    // let menus = [
    //     {id: 'system', title: '系统管理', order: 900},
    //     {id: 'user', parentId: 'system', title: '用户管理', path: '/users', order: 900},
    //     {id: 'role', parentId: 'system', title: '角色管理', path: '/roles', order: 900},
    //     {id: 'menus', parentId: 'system', title: '菜单管理', path: '/menus', order: 900},
    //
    //     {
    //         id: 'system2', title: 'React Admin', order: 900,
    //         target: 'qiankun',
    //         name: 'react-admin',
    //         basePath: '/react-admin',
    //         entry: 'http://172.16.40.72:3000',
    //     },
    //     {id: 'user2', parentId: 'system2', title: '用户管理', path: '/users', order: 900},
    //     {id: 'role2', parentId: 'system2', title: '角色管理', path: '/roles', order: 900},
    //     {id: 'menus2', parentId: 'system2', title: '菜单管理', path: '/menus', order: 900},
    // ];

    return formatMenus(menus);
}

export async function getPermissions() {
    const serverMenus = await getServerMenus();
    return serverMenus.filter(item => item.type === 2)
        .map(item => item.code);
}

let CACHE_AJAX; // ajax请求（promise）缓存
function getServerMenus() {
    // 登录页面，不加载
    if (isLoginPage()) return [];

    const run = () => {
        CACHE_AJAX = CACHE_AJAX || ajax.get('/user/menus')
            .then(res => (res || []).map(item => ({
                ...item,
            })));
        return CACHE_AJAX;
    };

    // 开启Mock时，菜单请求会在mock生效之前执行，无法被mock捕获，通过setTimeout解决
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_MOCK) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                run().then(resolve, reject);
            });
        });
    }

    return run();
}

/**
 说明：
 菜单数据，可以是 id + parentId 扁平结构，也可以是 id + children树状结构
 id: string, 主键 必填
 parentId: string, 父级id 非必填
 icon: string, 菜单图标 非必填
 title: string, 菜单标题 或 权限码标题 必填
 basePath: string, 基础路径，所有后代节点都会拼接上 非必填
 path: string, 路由地址或者第三方网站地址 非必填
 target: string, 菜单目标，menu: 应用菜单，qiankun: 乾坤子应用，iframe: iframe内嵌第三方，_self: 当前窗口打开第三方, _blank: 新开窗口打开第三方 必填
 order: number, 排序，越大越靠前 非必填，默认0
 type: string, 类型，菜单或权限码 必填
 name: string, 微前端子应用注册名称，唯一不可重复 target===qiankun 必填
 entry: string, 微前端子应用入口地址 target===qiankun 必填
 code: string, 权限码 type==权限码 必填
 **/
