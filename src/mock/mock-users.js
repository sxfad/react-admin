import executeSql from './db';

export default {
    /**
     * 查询用户列表
     * @param config
     * @returns {Promise<[number, {total: number, list: *}]>}
     */
    'get /users': async (config) => {
        const {
            pageSize,
            pageNum,
            // name,
            // mobile,
        } = config.params;

        const list = await executeSql('select * from users order by updatedAt desc limit ? offset ?', [pageSize, (pageNum - 1) * pageSize]);
        const countResult = await executeSql('select count(*) from users');
        const total = countResult[0]['count(*)'] || 0;

        return [200, {
            total,
            list,
        }];
    },

    // 用户登录
    'post /login': async (config) => {
        const {
            userName,
            password,
        } = JSON.parse(config.data);

        const result = await executeSql('select * from users where account=? and password=?', [userName, password]);
        if (!result?.length) return [400, {message: '用户名或密码错误'}];

        const user = result[0];
        user.token = 'test token';

        return [200, user];
    },
    // 退出登录
    'post /logout': {},


    'get re:/users/.+': {id: 1, name: '熊大', age: 22, job: 0, position: '1'},
    'post /users': true,
    'put /users': true,
    'delete /users': true,
    'delete re:/users/.+': true,
};
