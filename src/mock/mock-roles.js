import {getRolesByPageSize} from './mockdata/roles';
import {randomNumber, randomArray} from './util';

const allMenuKeys = ['antDesign', 'document', 'customer-header', 'user', 'role', 'menu', 'gen', 'page404', 'example', 'table-editable'];

export default {
    'get /roles': (config) => {
        const {
            pageSize,
            pageNum,
        } = config.params;

        return new Promise((resolve) => {
            setTimeout(() => {
                Math.random() < 0 ?
                    resolve([400, {message: '查询出错了！'}])
                    :
                    resolve([200, {
                        pageNum,
                        pageSize,
                        total: 666,
                        list: getRolesByPageSize(pageSize),
                    }]);
            }, 1000);
        });
    },
    'post /roles': true,
    'put /roles': true,
    'delete /roles': true,
    'get /roleMenus': () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([200, randomArray(allMenuKeys, randomNumber(5))]);
            }, 500);
        });
    },
    'get re:/roles/.+': {id: 1, name: '系统管理员', description: '描述'},
    'post /roles/menus 1000': true,
    'delete re:/roles/.+': true,
};
