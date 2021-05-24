// import {ajax} from 'src/commons/ajax';
import {Icon} from 'src/components';
import {quickSort} from '@ra-lib/util';

/**
 * 菜单数据，可以是 id + parentId 扁平结构，也可以是 id + children树状结构
 * 必须字段：
 *  id
 *  parentId 或 children
 *  title
 *  path
 *
 * @param userId
 * @returns {Promise<[{
 * id: string,
 * parentId: string,
 * icon: string,
 * title: string,
 * basePath: string,
 * path: string,
 * target: string,
 * order: number,
 * }]>}
 * @description
 *  basePath: 基础路径，所有后代节点都会拼接上
 *  path: 路由地址或者第三方网站地址
 *  target: 第三方网站打开方式，如果为iframe，通过iframe内嵌到当前系统中
 *  order: 排序，越大越靠前
 */
export default async function getMenus(userId) {
    // userId 也许不用传递，后端可以根据 token 获取到当前用户信息
    // const menus = await ajax.get('/menus', {userId}).then(res => {
    //     return (res || []);
    // });

    const menus = [
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
        {id: 'antDesign', parentId: 'other-site', title: 'Ant Design 官网', path: 'https://ant-design.gitee.io', order: 2000},
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
    ];

    return loopMenus(menus);
}

/**
 * 菜单数据处理函数
 * @param nodes
 * @param basePath
 */
function loopMenus(nodes, basePath) {
    // 排序 order降序， 越大越靠前
    nodes = quickSort(nodes, (a, b) => b.order - a.order);

    nodes.forEach(item => {
        let itemBasePath = basePath;

        let {icon, path, target, children} = item;

        // 非树结构，获取basePath
        const parentNode = nodes.find(it => it.id === item.parentId);
        if (parentNode?.basePath) itemBasePath = parentNode.basePath;

        // 树状结构bashPath向下透传
        if (itemBasePath && !('basePath' in item)) item.basePath = itemBasePath;

        // 拼接基础路径
        if (itemBasePath && path && (!path.startsWith('http') || !path.startsWith('//'))) {
            item.path = path = `${itemBasePath}${path}`;
        }

        // 图标处理，数据库中持久换存储的是字符串
        if (icon) item.icon = <Icon type={icon}/>;

        // 第三方页面处理，如果target为iframe，内嵌到当前系统中
        if (target === 'iframe') {
            // 页面跳转 : 内嵌iFrame
            item.path = `/iframe_page_/${encodeURIComponent(path)}`;
            Reflect.deleteProperty(item, 'target');
        }

        if (children?.length) loopMenus(children, item.basePath);
    });

    return nodes;
}
