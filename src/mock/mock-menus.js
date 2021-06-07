import moment from 'moment';
import executeSql from 'src/mock/db';

export default {
    // 获取用户菜单
    'get /user/menus': async (config) => {
        const {
            userId,
        } = config.params;
        const userRoles = await executeSql('select * from user_roles where userId = ?', [userId]);

        if (!userRoles?.length) return [200, []];
        const roleIds = userRoles.map(item => item.roleId).join(',');

        const roleMenus = await executeSql(`select *
                                            from role_menus
                                            where roleId in (${roleIds})`);

        if (!roleMenus?.length) return [200, []];

        const menusId = roleMenus.map(item => item.menuId).join(',');
        const menus = await executeSql(`select *
                                        from menus
                                        where id in (${menusId})`);

        return [200, Array.from(menus)];
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
        const {keys, args, holders} = getMenuData(config);

        const result = await executeSql(`
            INSERT INTO menus (${keys})
            VALUES (${holders})
        `, args, true);
        const {insertId: menuId} = result;

        return [200, menuId];
    },
    // 修改
    'put /menus': async config => {
        const {id} = JSON.parse(config.data);
        const {keys, args} = getMenuData(config);

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
        const id = config.url.split('/')[2];
        await executeSql('DELETE FROM menus WHERE id=?', [id]);
        await executeSql('DELETE FROM role_menus WHERE menuId=?', [id]);
        return [200, true];
    },
    // 批量更新功能列表
    'post /actions': async config => {
        const {actions, parentId} = JSON.parse(config.data);
        if (actions && actions.length) {
            const codes = [];

            for (let action of actions) {
                const {code} = action;
                if (codes.includes(action.code)) return [400, {message: `权限码：「${code} 」不能重复`}];
                codes.push(code);
            }
        }
        const oldActions = await executeSql('select * from menus where parentId=? and type=?', [parentId, 2]);

        // 保持id
        actions.forEach(item => {
            const {code} = item;
            const action = oldActions.find(it => it.code === code);
            item.id = action?.id;
        });
        // 删除所有旧的action
        await executeSql('delete  from menus where parentId=? and type=?', [parentId, 2]);
        // 插入新的action
        for (let action of actions) {
            const {id, parentId, title, code, type = 2} = action;

            const data = {parentId, title, code, type};

            const keys = Object.keys(data);
            const values = Object.values(data);
            const holders = ['?', '?', '?', '?'];

            if (id) {
                keys.push('id');
                values.push(id);
                holders.push('?');
            }
            const oldAction = await executeSql('select * from menus where code=? and type=2', [code]);
            if (oldAction?.length) return [400, {message: `权限码：「${code} 」不能重复`}];

            await executeSql(`insert into menus (${keys})
                              values (${holders})`,
                values,
            );
        }
        return [200, true];
    },
};

function getMenuData(config) {
    const {
        target,
        parentId = '',
        title,
        basePath = '',
        path = '',
        order = 0,
        name = '',
        entry = '',
        icon = '',
        code = '',
        type,
    } = JSON.parse(config.data);
    const data = Object.entries({
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
    });


    const keys = data.map(([key]) => key);
    const args = data.map(([, value]) => value);
    const holders = data.map(() => '?');

    return {keys, args, holders};
}
