import moment from 'moment';
import executeSql from 'src/mock/web-sql';

export default {
    // 获取列表
    'get /role/queryRoleByPage': async (config) => {
        const { pageSize, pageNum, name = '' } = config.params;

        const where = `where name like '%${name}%'`;

        if (!pageSize && !pageNum) {
            const list = await executeSql(`
                select *
                from roles ${where}
                order by updatedAt desc`);

            await addSystemName(list);

            return [200, list];
        }

        const list = await executeSql(
            `
            select *
            from roles ${where}
            order by updatedAt desc
            limit ? offset ?`,
            [pageSize, (pageNum - 1) * pageSize],
        );

        const countResult = await executeSql(`
            select count(*)
            from roles ${where}`);

        const total = countResult[0]['count(*)'] || 0;

        await addSystemName(list);

        return [
            200,
            {
                totalElements: total,
                content: list,
            },
        ];
    },
    'get /role/queryEnabledRoles': async (config) => {
        const list = await executeSql(`
            select *
            from roles
            where enabled = 1
            order by updatedAt desc
        `);

        await addSystemName(list);

        return [200, list];
    },
    // 获取详情
    'get /role/getRoleDetailById': async (config) => {
        const { id } = config.params;

        const result = await executeSql('select * from roles where id = ?', [id]);

        if (!result[0]) return [200, null];

        const roleMenus = await executeSql('select * from role_menus where roleId = ?', [id]);
        result[0].menuIds = roleMenus.map((item) => item.menuId);

        return [200, result[0]];
    },
    // 根据name获取
    'get /role/getOneRole': async (config) => {
        const { name, systemId } = config.params;

        const result = await executeSql('select * from roles where name = ? and systemId=?', [name, systemId]);
        return [200, result[0]];
    },
    // 添加
    'post /role/addRole': async (config) => {
        const { name, remark = '', enabled, systemId, menuIds } = JSON.parse(config.data);
        const args = [systemId, 3, name, remark, enabled ? 1 : 0];
        const result = await executeSql(
            'INSERT INTO roles (systemId, type, name, remark, enabled) VALUES (?, ?, ?, ?, ?)',
            args,
            true,
        );
        const { insertId: roleId } = result;

        if (menuIds?.length) {
            for (let menuId of menuIds) {
                await executeSql('INSERT INTO role_menus (roleId, menuId) VALUES (?,?)', [roleId, menuId]);
            }
        }

        return [200, roleId];
    },
    // 修改
    'post /role/updateRoleById': async (config) => {
        const { id, name, remark = '', enabled, systemId, menuIds } = JSON.parse(config.data);
        const args = [enabled ? 1 : 0, systemId, name, remark, moment().format('YYYY-MM-DD HH:mm:ss'), id];

        await executeSql('UPDATE roles SET enabled=?, systemId=?, name=?, remark=?, updatedAt=? WHERE id=?', args);
        await executeSql('DELETE FROM role_menus WHERE roleId=?', [id]);

        if (menuIds?.length) {
            for (let menuId of menuIds) {
                await executeSql('INSERT INTO role_menus (roleId, menuId) VALUES (?,?)', [id, menuId]);
            }
        }

        return [200, true];
    },
    // 删除
    'delete re:/role/.+': async (config) => {
        const id = config.url.split('/')[2];
        await executeSql('DELETE FROM roles WHERE id=?', [id]);
        await executeSql('DELETE FROM role_menus WHERE roleId=?', [id]);
        return [200, true];
    },
};

async function addSystemName(list) {
    const systemIds = list.map((item) => item.systemId).filter((item) => !!item);
    if (systemIds && systemIds.length) {
        const systems = await executeSql(`
            select *
            from menus
            where id in (${systemIds})
        `);
        list.forEach((item) => {
            const { systemId } = item;
            if (systemId) {
                const system = systems.find((sys) => sys.id === systemId);
                if (system) item.systemName = system.title;
            }
        });
    }
}
