import {getUsersByPageSize} from './mockdata/user';

export default {
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

    'get /users': (config) => {
        const {
            pageSize,
            pageNum,
        } = config.params;


        return new Promise((resolve) => {
            setTimeout(() => {
                Math.random() < .3 ?
                    resolve([400, {message: '查询出错了！'}])
                    :
                    resolve([200, {
                        pageNum,
                        pageSize,
                        total: 888,
                        list: getUsersByPageSize(pageSize),
                    }]);
            }, 1000);
        });
    },
    'get re:/users/.+': {id: 1, name: '熊大', age: 22, job: 0, position: '1'},
    'post /users': true,
    'put /users': true,
    'delete /users': true,
    'delete re:/users/.+': true,
};
