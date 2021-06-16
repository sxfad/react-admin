import {checkSameField, convertToTree, sort} from '@ra-lib/util';
import ajax from 'src/commons/ajax';
import {isLoginPage, getLoginUser} from 'src/commons';
import {Icon} from 'src/components';
import options from 'src/options';

const menuTargetOptions = options.menuTarget;

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
 type: number, 类型，菜单或权限码 必填 菜单：1 权限码：2
 name: string, 微前端子应用注册名称，唯一不可重复 target===qiankun 必填
 entry: string, 微前端子应用入口地址 target===qiankun 必填
 code: string, 权限码 type==权限码 必填
 **/

async function getMenuData() {
    // 登录页面，不加载
    if (isLoginPage()) return [];

    // 获取服务端数据，并做缓存，防止多次调用接口
    return getMenuData.__CACHE = getMenuData.__CACHE
        || ajax.get('/authority/queryUserMenus', {userId: getLoginUser()?.id})
            .then(res => res.map(item => ({...item, order: item.ord})));

    // 前端硬编码菜单
    // return [
    //     {id: 'system', title: '系统管理', order: 900, type: 1},
    //     {id: 'user', parentId: 'system', title: '用户管理', path: '/users', order: 900, type: 1},
    //     {id: 'role', parentId: 'system', title: '角色管理', path: '/roles', order: 900, type: 1},
    //     {id: 'menus', parentId: 'system', title: '菜单管理', path: '/menus', order: 900, type: 1},
    // ];
}


export default async function getMenus() {
    // 启用mock时，getMenuData，会早于mock生效前调用，这里做个延迟
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_MOCK) {
        await new Promise(resolve => setTimeout(resolve));
    }

    const serverMenus = await getMenuData();
    const menus = serverMenus.filter(item => item.type === 1);

    return formatMenus(menus);
}

export async function getCollectedMenus() {
    // 登录页面，不加载
    if (isLoginPage()) return [];

    const loginUser = getLoginUser();
    const collectedMenus = await ajax.get('/authority/queryUserCollectedMenus', {userId: loginUser?.id});
    collectedMenus.forEach(item => item.isCollectedMenu = true);
    return formatMenus(collectedMenus);
}

export async function getPermissions() {
    const serverMenus = await getMenuData();
    return serverMenus.filter(item => item.type === 2)
        .map(item => item.code);
}


/**
 * 处理菜单数据
 * @param menus
 * @returns {*}
 */
function formatMenus(menus) {
    // id转字符串
    menus.forEach(item => {
        item.id = `${item.id}`;
        item.parentId = item.parentId ? `${item.parentId}` : item.parentId;
    });
    // 检测是否有重复id
    const someId = checkSameField(menus, 'id');
    if (someId) throw Error(`菜单中有重复id 「 ${someId} 」`);

    // 排序 order降序， 越大越靠前
    return loopMenus(convertToTree(sort(menus, (a, b) => b.order - a.order)));
}

/**
 * 菜单数据处理函数{}
 * @param menus
 * @param basePath
 */
function loopMenus(menus, basePath) {
    menus.forEach(item => {
        let {icon, path, target, children} = item;

        // 保存原始target数据
        item._target = target;

        // 树状结构bashPath向下透传
        if (basePath && !('basePath' in item)) item.basePath = basePath;

        // 乾坤子项目约定
        if (target === menuTargetOptions.QIANKUN) item.basePath = `/${item.name}`;

        // 拼接基础路径
        if (basePath && path && (!path.startsWith('http') || !path.startsWith('//'))) {
            item.path = path = `${basePath}${path}`;
        }

        // 图标处理，数据库中持久换存储的是字符串
        if (icon) item.icon = <Icon type={icon}/>;

        // 第三方页面处理，如果target为iframe，内嵌到当前系统中
        if (target === menuTargetOptions.IFRAME) {
            // 页面跳转 : 内嵌iFrame
            item.path = `/iframe_page_/${encodeURIComponent(path)}`;
        }

        if (![menuTargetOptions.SELF, menuTargetOptions.BLANK].includes(target)) {
            Reflect.deleteProperty(item, 'target');
        }

        if (children?.length) loopMenus(children, item.basePath);
    });

    return menus;
}
