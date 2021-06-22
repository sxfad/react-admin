import moment from 'moment';
import executeSql from './web-sql';

export default {
    // 获取列表
    'get /roles': async (config) => {
        const {
            pageSize,
            pageNum,
            name = '',
        } = config.params;

        const where = `where roles.name like '%${name}%'`;

        async function addSystem(list) {
            const menus = await executeSql(`
                select *
                from menus
                where id in (${list.map(item => item.systemId).filter(systemId => !!systemId)})
            `);
            list.forEach(role => {
                const system = menus.find(menu => menu.id === role.systemId);
                role.systemName = system?.title;
            });
        }

        if (!pageSize && !pageNum) {
            const list = await executeSql(`
                select *
                from roles
                where enabled = 1
                order by updatedAt desc`);
            await addSystem(list);

            return [200, list];
        }

        const list = await executeSql(`
            select *
            from roles ${where}
            order by updatedAt desc
            limit ? offset ?`, [pageSize, (pageNum - 1) * pageSize]);

        await addSystem(list);

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
            systemId,
        } = config.params;

        // 系统内不可重复
        if (systemId) {
            const result = await executeSql('select * from roles where name = ? and systemId=?', [name, systemId]);
            return [200, result[0]];
        }

        const result = await executeSql('select * from roles where name = ?', [name]);
        return [200, result[0]];

    },
    // 添加
    'post /roles': async config => {
        let {
            name,
            remark = '',
            enabled,
            menuIds,
            systemId = null,
            type = 3,
        } = JSON.parse(config.data);
        enabled = enabled ? 1 : 0;

        const args = [name, remark, enabled, systemId, type, moment().format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')];
        const result = await executeSql('INSERT INTO roles (name, remark, enabled, systemId, type, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)', args, true);
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
            enabled,
            menuIds,
            systemId,
        } = JSON.parse(config.data);
        enabled = enabled ? 1 : 0;
        const args = [name, remark, enabled, systemId, moment().format('YYYY-MM-DD HH:mm:ss'), id];

        await executeSql('UPDATE roles SET name=?, remark=?, enabled=?, systemId=?, updatedAt=? WHERE id=?', args);
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
