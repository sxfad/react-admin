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
    'put /menus': true,
    'delete re:/menus/.+': true,
};
