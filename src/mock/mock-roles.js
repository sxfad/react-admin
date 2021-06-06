import {randomNumber, randomArray} from './util';
import executeSql from 'src/mock/db';

const allMenuKeys = ['antDesign', 'document', 'customer-header', 'user', 'role', 'menu', 'gen', 'page404', 'example', 'table-editable'];

export default {
    // 获取所有角色
    'get /roles': async (config) => {
        const {
            pageSize,
            pageNum,
        } = config.params;

        if (!pageSize && !pageNum) {
            const list = await executeSql('select * from roles order by updatedAt desc');
            return [200, list];
        }

        const list = await executeSql('select * from roles order by updatedAt desc limit ? offset ?', [pageSize, (pageNum - 1) * pageSize]);
        const countResult = await executeSql('select count(*) from roles');
        const total = countResult[0]['count(*)'] || 0;

        return [200, {
            total,
            list,
        }];
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
