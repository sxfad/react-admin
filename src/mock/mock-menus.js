import moment from 'moment';
import { convertToTree, findGenerationNodes } from '@ra-lib/util';
import executeSql from 'src/mock/web-sql';
import { WITH_SYSTEMS } from 'src/config';

export default {
    // 获取系统
    'get /systems': async (config) => {
        const list = await executeSql(`
            select *
            from menus
            where parentId is null
               or parentId = ?
        `, ['']);

        return [200, list];
    },
    // 获取用户菜单
    'get /userMenus': async (config) => {
        const {
            userId,
        } = config.params;
        const urs = await executeSql('select * from user_roles where userId = ?', [userId]);

        const userRoles = await executeSql(`select *
                                            from roles
                                            where id in (${urs.map(item => item.roleId)})`);

        if (!userRoles?.length) return [200, []];

        // type === 1 为超级管理员，返回所有权限，
        // type === 2 为子系统管理员，返回当前子系统所有权限

        const isSuperAdmin = userRoles.some(item => item.type === 1);
        const allMenus = await executeSql(`select *
                                           from menus
                                           where enable = 1`);

        if (isSuperAdmin) {
            return [200, allMenus];
        }

        const adminRoles = userRoles.filter(item => item.type === 2);

        const systemIds = adminRoles.map(item => item.systemId).filter(id => !!id);

        const allMenusTreeData = convertToTree(allMenus);

        let menus = systemIds.map(id => allMenus.find(item => item.id === id));

        systemIds.forEach(systemId => {
            const nodes = findGenerationNodes(allMenusTreeData, systemId, 'id');
            nodes.forEach(menu => {
                if (!menus.some(it => it.id === menu.id)) menus.push(menu);
            });
        });

        const roleIds = userRoles.map(item => item.id);

        const roleMenus = await executeSql(`select *
                                            from role_menus
                                            where roleId in (${roleIds})`);

        roleMenus.forEach(item => {
            const menuId = item.menuId;
            const menu = allMenus.find(item => item.id === menuId);
            if (!menus.some(it => it.id === menu.id)) menus.push(menu);
        });

        return [200, menus];
    },
    // 获取用户收藏菜单
    'get /userCollectedMenus': async config => {
        const {
            userId,
        } = config.params;

        const userMenus = await executeSql('select * from user_menus where userId = ?', [userId]);
        const menuIds = userMenus.map(item => item.menuId);

        const result = await executeSql(`select * from menus where id in(${menuIds})`);
        return [200, result];
    },
    // 修改用户收藏菜单
    'post /userCollectMenu': async config => {
        let { userId, menuId, collected } = JSON.parse(config.data);
        menuId = parseInt(menuId);

        const menus = await executeSql('select * from menus');
        const nodes = findGenerationNodes(convertToTree(menus), menuId);
        const menuIds = nodes.filter(item => item.type === 1).map(item => item.id);
        menuIds.push(menuId);

        if (collected) {
            // 子菜单全部加入
            for (let mId of menuIds) {
                await executeSql('insert into user_menus (userId, menuId) values (?, ?)', [userId, mId]);
            }
        } else {
            // 子菜单全部取消
            for (let mId of menuIds) {
                await executeSql('delete from user_menus where userId=? and menuId = ?', [userId, mId]);
            }
        }

        return [200, true];
    },

    // 获取所有
    'get /menus': async config => {
        const result = await executeSql('select * from menus');

        return [200, result];
    },
    // 根据name获取
    'get /menuByName': async config => {
        const {
            name,
        } = config.params;


        const result = await executeSql('select * from menus where name = ?', [name]);
        return [200, result[0]];
    },
    // 根据code获取action
    'get /actionByCode': async config => {
        const {
            code,
        } = config.params;

        const result = await executeSql('select * from menus where code = ? and type=2', [code]);
        return [200, result[0]];
    },
    // 添加
    'post /menus': async config => {
        const { keys, args, holders, data } = getMenuData(config);

        const result = await executeSql(`
            INSERT INTO menus (${keys})
            VALUES (${holders})
        `, args, true);
        const { insertId: menuId } = result;

        // 如果是主应用并且创建的是顶级菜单，则创建一个系统管理员
        if (WITH_SYSTEMS && !data.parentId) {
            const roleArgs = ['系统管理员', 1, '拥有当前子系统所有权限', 2, menuId];
            await executeSql(`
                INSERT INTO roles (name, enable, remark, type, systemId)
                VALUES (?, ?, ?, ?, ?)
            `, roleArgs);
        }

        return [200, menuId];
    },
    // 批量添加
    'post /branchMenus': async config => {
        const {
            menus,
            parentId,
        } = JSON.parse(config.data);

        if (!menus?.length) return [200, true];

        // 获取menu最大id
        const result = await executeSql('select * from menus order by id desc limit ? offset ? ', [1, 0]);
        const maxId = result[0] ? result[0].id : 0;

        // 处理id
        const idMap = {};
        menus.forEach((menu, index) => {
            const { id } = menu;
            const nextId = menu.id = maxId + index + 1;
            if (id) idMap[id] = nextId;

            if (!menu.type) menu.type = 1;

            if (!menu.parentId) menu.parentId = parentId;
        });

        // 处理parentId
        menus.forEach((menu) => {
            const { parentId } = menu;
            if (idMap[parentId]) {
                menu.parentId = idMap[parentId];
            }
        });

        let menuId;
        // 插入数据库
        for (let i = 0; i < menus.length; i++) {
            const menu = menus[i];
            const { id } = menu;
            const { keys, args, holders } = getMenuData({ data: menu }, value => value);
            keys.push('id');
            args.push(id);
            holders.push('?');

            const result = await executeSql(`
                INSERT INTO menus (${keys})
                VALUES (${holders})
            `, args, true);
            if (i === 0) menuId = result.insertId;
        }

        return [200, menuId];
    },
    // 修改
    'put /menus': async config => {
        const { id } = JSON.parse(config.data);
        const { keys, args } = getMenuData(config);

        keys.push('updatedAt');
        args.push(moment().format('YYYY-MM-DD HH:mm:ss'));
        args.push(id);
        const arr = keys.map(key => key + '=?');

        await executeSql(`UPDATE menus
                          SET ${arr}
                          WHERE id = ?`, args);

        return [200, true];

    },
    // 删除
    'delete re:/menus/.+': async config => {
        const id = parseInt(config.url.split('/')[2]);
        const allMenus = await executeSql('select * from menus');
        const menuTreeData = convertToTree(allMenus);

        const nodes = findGenerationNodes(menuTreeData, id, 'id') || [];
        const ids = nodes.map(item => item.id);
        ids.push(id);

        await executeSql(`DELETE
                          FROM menus
                          WHERE id in (${ids})`);
        await executeSql(`DELETE
                          FROM role_menus
                          WHERE menuId in (${ids})`);
        return [200, true];
    },
    // 批量更新功能列表
    'post /actions': async config => {
        const { actions, parentId } = JSON.parse(config.data);
        if (actions && actions.length) {
            const codes = [];

            for (let action of actions) {
                const { code } = action;
                if (codes.includes(action.code)) return [400, { message: `权限码：「${code} 」不能重复` }];
                codes.push(code);
            }
        }
        const oldActions = await executeSql('select * from menus where parentId=? and type=?', [parentId, 2]);

        // 保持id
        actions.forEach(item => {
            const { code } = item;
            const action = oldActions.find(it => it.code === code);
            item.id = action?.id;
        });
        // 删除所有旧的action
        await executeSql('delete  from menus where parentId=? and type=?', [parentId, 2]);
        // 插入新的action
        for (let action of actions) {
            let { id, title, code, enable, type = 2 } = action;
            enable = enable ? 1 : 0;

            const data = { parentId, title, code, enable, type };

            const keys = Object.keys(data);
            const values = Object.values(data);
            const holders = values.map(() => '?');

            if (id) {
                keys.push('id');
                values.push(id);
                holders.push('?');
            }
            const oldAction = await executeSql('select * from menus where code=? and type=2', [code]);
            if (oldAction?.length) return [400, { message: `权限码：「${code} 」不能重复` }];

            await executeSql(`insert into menus (${keys})
                              values (${holders})`,
                values,
            );
        }
        return [200, true];
    },
};

function getMenuData(config, parse = JSON.parse) {
    let {
        target = 'menu',
        parentId = '',
        title,
        basePath = '',
        path = '',
        order = 0,
        name = '',
        entry = '',
        icon = '',
        code = '',
        type = 1,
        enable,
    } = parse(config.data);
    enable = enable ? 1 : 0;

    const data = {
        target,
        parentId,
        title,
        basePath,
        path,
        // eslint-disable-next-line
        ['`order`']: order, // 数据库关键字
        name,
        entry,
        icon,
        code,
        type,
        enable,
    };
    const keyValues = Object.entries(data);


    const keys = keyValues.map(([key]) => key);
    const args = keyValues.map(([, value]) => value);
    const holders = keyValues.map(() => '?');

    return { keys, args, holders, data };
}
