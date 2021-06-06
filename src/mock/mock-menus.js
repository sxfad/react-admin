import executeSql from 'src/mock/db';

export default {
    // 获取用户菜单
    'get /user/menus': async (config) => {
        // TODO 根据用户角色，获取菜单
        const result = await executeSql('select * from menus');
        return [200, Array.from(result.rows)];
    },
    'post /menus': {id: '123'},
    'put /menus': true,
    'delete re:/menus/.+': true,
};
