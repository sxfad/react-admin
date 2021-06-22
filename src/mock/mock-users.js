import moment from 'moment';
import executeSql, {initDB} from './web-sql';

export default {
    // 重置数据库
    'post /initDB': async config => {
        await initDB(true);
        return [200, true];
    },
    // 用户登录
    'post /login': async (config) => {
        const {
            userName,
            password,
        } = JSON.parse(config.data);

        const result = await executeSql('select * from users where account=? and password=? and enabled=1', [userName, password]);
        if (!result?.length) return [400, {message: '用户名或密码错误'}];

        const user = result[0];
        user.token = 'test token';

        return [200, user];
    },
    // 退出登录
    'post /logout': {},
    // 获取列表
    'get /users': async (config) => {
        const {
            pageSize = 10,
            pageNum = 1,
            account = '',
            name = '',
            mobile = '',
        } = config.params;

        const where = `
            where name like '%${name}%'
                and mobile like '%${mobile}%'
                and account like '%${account}%'
        `;

        const list = await executeSql(`
            select *
            from users ${where}
            order by updatedAt desc
            limit ? offset ?`, [pageSize, (pageNum - 1) * pageSize]);

        const countResult = await executeSql(`
            select count(*)
            from users ${where}
        `);

        const total = countResult[0]['count(*)'] || 0;

        return [200, {
            total,
            list,
        }];
    },
    // 获取详情
    'get re:/users/.+': async config => {
        const id = config.url.split('/')[2];

        const result = await executeSql('select * from users where id = ?', [id]);

        if (!result[0]) return [200, null];

        const userRoles = await executeSql('select * from user_roles where userId = ?', [id]);
        result[0].roleIds = userRoles.map(item => item.roleId);

        return [200, result[0]];
    },
    // 根据account获取
    'get /userByAccount': async config => {
        const {
            account,
        } = config.params;


        const result = await executeSql('select * from users where account = ?', [account]);
        return [200, result[0]];
    },
    // 保存
    'post /users': async config => {
        let {
            account,
            name,
            password,
            email,
            mobile,
            enabled,
            roleIds,
        } = JSON.parse(config.data);
        enabled = enabled ? 1 : 0;

        const args = [account, name, password, mobile, email, enabled, moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')];
        const result = await executeSql('INSERT INTO users (account, name, password, mobile, email, enabled, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', args, true);
        const {insertId: userId} = result;

        if (roleIds?.length) {
            for (let roleId of roleIds) {
                await executeSql('INSERT INTO user_roles (roleId, userId) VALUES (?,?)', [roleId, userId]);
            }
        }

        return [200, userId];
    },
    // 修改
    'put /users': async config => {
        let {
            id,
            account,
            name,
            password,
            email,
            mobile,
            enabled,
            roleIds,
        } = JSON.parse(config.data);
        enabled = enabled ? 1 : 0;
        const args = [account, name, password, mobile, email, enabled, moment().format('YYYY-MM-DD HH:mm:ss'), id];

        await executeSql('UPDATE users SET account=?, name=?, password=?, mobile=?, email=?, enabled=?, updatedAt=? WHERE id=?', args);
        await executeSql('DELETE FROM user_roles WHERE userId=?', [id]);

        if (roleIds?.length) {
            for (let roleId of roleIds) {
                await executeSql('INSERT INTO user_roles (roleId, userId) VALUES (?,?)', [roleId, id]);
            }
        }

        return [200, true];

    },
    // 删除
    'delete re:/users/.+': async config => {
        const id = config.url.split('/')[2];
        await executeSql('DELETE FROM users WHERE id=?', [id]);
        await executeSql('DELETE FROM user_roles WHERE userId=?', [id]);
        return [200, true];
    },
};
