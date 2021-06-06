import executeSql from './db';

export default {
    /**
     * 查询用户列表
     * @param config
     * @returns {Promise<unknown>}
     */
    'get /users': async (config) => {
        const {
            pageSize,
            pageNum,
        } = config.params;

        const result = await executeSql('select * from users');
        return [200, {
            pageNum,
            pageSize,
            total: 888,
            list: result,
        }];
    },

    'post /login': (config) => {
        const {
            userName,
            password,
        } = JSON.parse(config.data);
        return new Promise((resolve, reject) => {
            if (userName !== 'admin' || password !== '111') {
                setTimeout(() => {
                    reject({
                        code: 1001,
                        message: '用户名或密码错误',
                    });
                }, 1000);
            } else {
                setTimeout(() => {
                    resolve([200, {
                        id: '1234567890abcde',
                        name: 'MOCK 用户',
                        loginName: 'MOCK 登录名',
                    }]);
                }, 1000);
            }
        });
    },
    'post /logout': {},


    'get re:/users/.+': {id: 1, name: '熊大', age: 22, job: 0, position: '1'},
    'post /users': true,
    'put /users': true,
    'delete /users': true,
    'delete re:/users/.+': true,
};
