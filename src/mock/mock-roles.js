import moment from 'moment';
import executeSql from 'src/mock/web-sql';

export default {
    // 获取列表
    'get /roles': async (config) => {
        const {
            pageSize,
            pageNum,
            name = '',
        } = config.params;

        const where = `where name like '%${name}%'`;

        if (!pageSize && !pageNum) {
            const list = await executeSql(`
                select *
                from roles where enable = 1
                order by updatedAt desc`);

            return [200, list];
        }

        const list = await executeSql(`
            select *
            from roles ${where}
            order by updatedAt desc
            limit ? offset ?`, [pageSize, (pageNum - 1) * pageSize]);

        const countResult = await executeSql(`
            select count(*)
            from roles ${where}`);

        const total = countResult[0]['count(*)'] || 0;

        return [200, {
            total,
            list,
        }];
    },
    // 获取详情
    'get re:/roles/.+': async config => {
        const id = config.url.split('/')[2];

        const result = await executeSql('select * from roles where id = ?', [id]);

        if (!result[0]) return [200, null];

        const roleMenus = await executeSql('select * from role_menus where roleId = ?', [id]);
        result[0].menuIds = roleMenus.map(item => item.menuId);

        return [200, result[0]];
    },
    // 根据name获取
    'get /roleByName': async config => {
        const {
            name,
        } = config.params;


        const result = await executeSql('select * from roles where name = ?', [name]);
        return [200, result[0]];
    },
    // 添加
    'post /roles': async config => {
        let {
            name,
            remark = '',
            enable,
            menuIds,
        } = JSON.parse(config.data);
        enable = enable ? 1 : 0;

        const args = [name, remark, enable, moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')];
        const result = await executeSql('INSERT INTO roles (name, remark, enable, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)', args, true);
        const {insertId: roleId} = result;

        if (menuIds?.length) {
            for (let menuId of menuIds) {
                await executeSql('INSERT INTO role_menus (roleId, menuId) VALUES (?,?)', [roleId, menuId]);
            }
        }

        return [200, roleId];
    },
    // 修改
    'put /roles': async config => {
        let {
            id,
            name,
            remark = '',
            enable,
            menuIds,
        } = JSON.parse(config.data);
        enable = enable ? 1 : 0;
        const args = [name, remark, enable, moment().format('YYYY-MM-DD HH:mm:ss'), id];

        await executeSql('UPDATE roles SET name=?, remark=?, enable=?, updatedAt=? WHERE id=?', args);
        await executeSql('DELETE FROM role_menus WHERE roleId=?', [id]);

        if (menuIds?.length) {
            for (let menuId of menuIds) {
                await executeSql('INSERT INTO role_menus (roleId, menuId) VALUES (?,?)', [id, menuId]);
            }
        }

        return [200, true];

    },
    // 删除
    'delete re:/roles/.+': async config => {
        const id = config.url.split('/')[2];
        await executeSql('DELETE FROM roles WHERE id=?', [id]);
        await executeSql('DELETE FROM role_menus WHERE roleId=?', [id]);
        return [200, true];
    },
};
