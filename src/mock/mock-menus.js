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
    // 获取所有菜单
    'get /menus': async config => {
        const result = await executeSql('select * from menus');

        return [200, result];
    },
    // 添加菜单
    'post /menus': async config => {
        const {keys, args, holders} = getMenuData(config);

        const result = await executeSql(`
            INSERT INTO menus (${keys})
            VALUES (${holders})
        `, args, true);
        const {insertId: menuId} = result;

        return [200, menuId];
    },
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
