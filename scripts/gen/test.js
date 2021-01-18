// const regEx = /[`~!@#$%^&*()_\-+=|{}':;',\[\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？ ]/;
// const str = '用户名，不,能添加 啊';
// console.log(regEx.test(str));
// console.log(str.split(regEx));


// console.log(new URL('mysql://fd:123456@172.16.60.247:3306/wechat_message'));
// const { getTableNames, getTableColumns } = require('./my-sql');
// const dbUrl = 'mysql://root:12345678@localhost:3306/front_center_dev';
// // const dbUrl = 'mysql://fd:123456@172.16.60.247:3306/wechat_message';
//
// getTableNames(dbUrl).then(data => {
//     console.log(data);
// });


const inflection = require('inflection');

const tableName = 'department_user-center';

// 下划线转连字符
const moduleName = inflection.camelize(tableName.replace(/-/g, '_'), true);

// 复数
const moduleNames = inflection.pluralize(moduleName);
const ModuleName = inflection.camelize(moduleName);
const ModuleNames = inflection.pluralize(ModuleName);

console.log('moduleName', moduleName);
console.log('moduleNames', moduleNames);
console.log('ModuleName', ModuleName);
console.log('ModuleNames', ModuleNames);
