import {getRolesByPageSize} from './mockdata/roles';

const allMenuKeys = ['antDesign', 'document', 'customer-header', 'user', 'role', 'menu', 'gen', 'page404', 'example', 'table-editable'];

function randomNumber(max) {
    return Math.ceil(Math.random() * max);
}

// 随机获取 数组中 count 个元素
function randomArray(arr, count) {
    const source = [...arr];
    const result = [];

    for (let i = 0; i < count; i++) {
        const randomIndex = randomNumber(source.length - 1);
        result.push(source.splice(randomIndex, 1));
    }
    return result.flat();
}

export default {
    'get /mock/role': () => {
        const pageSize = 30;

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([200, getRolesByPageSize(pageSize)]);
            }, 1000);
        });
    },
    'get /mock/roles/menus': () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([200, randomArray(allMenuKeys, randomNumber(5))]);
            }, 500);
        });
    },
    'post /mock/roles/menus 1000': true,
    'delete re:/mock/roles/.+': true,
    'get re:/mock/roles/.+': {id: 1, name: '系统管理员', description: '描述'},
};
