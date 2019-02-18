import Mock from 'mockjs';

const random = Mock.Random;
const LoginUsers = [
    {
        id: '5754195b570b367345584998',
        name: '超级管理员',
        loginName: 'admin',
        gender: 'male',
        org_key: '1464444570801',
        roleId: '5753f4706df8f6094bf3fc54',
        pass: '111111',
        salt: '03525b62-15aa-4ffe-a1ee-0385498e01f9',
        update_at: '2016-08-23T13:44:18.819Z',
        create_at: '2016-06-05T12:21:47.666Z',
        is_deleted: false,
        is_locked: false,
        is_first_login: false,
        position: 'CEO',
        mobile: '88888888888',
        email: 'admin@163.com',
        permissions: ['users-add', 'users-delete', 'users-update', 'users-search', 'users-reset-pass', 'users-toggle-lock', 'organization-add', 'organization-delete', 'organization-update', 'organization-search', 'role-add', 'role-update', 'role-delete', 'role-search', 'system', 'system-004002', 'system-004001', 'system-002'],
    },
    {
        id: '5754195b570b367345584998',
        name: '超级管理员',
        loginName: 'admin2',
        gender: 'male',
        org_key: '1464444570801',
        roleId: '5753f4706df8f6094bf3fc54',
        pass: '111111',
        salt: '03525b62-15aa-4ffe-a1ee-0385498e01f9',
        update_at: '2016-08-23T13:44:18.819Z',
        create_at: '2016-06-05T12:21:47.666Z',
        is_deleted: false,
        is_locked: false,
        is_first_login: false,
        position: 'CEO',
        mobile: '88888888888',
        email: 'admin@163.com',
        permissions: ['users-add', 'users-delete', 'users-update', 'users-search', 'users-reset-pass', 'users-toggle-lock', 'organization-add', 'organization-delete', 'organization-update', 'organization-search', 'role-add', 'role-update', 'role-delete', 'role-search', 'system', 'system-004002', 'system-004001', 'system-002'],
    },
];

export function getUsersByPageSize(pageSize) {
    const users = [];
    for (let i = 0; i < pageSize; i++) {
        users.push(Mock.mock({
            id: random.guid(),
            name: random.cname(),
            'age|18-60': 1,
            'job|1': ['程序员', '人事', '测试', '销售'],
            loginName: random.word(),
            email: random.email(),
            mobile: '18611438888',
            'gender|1': ['male', 'female'],
            position: 'ceo',
            is_locked: false,
            is_first_login: false,
            remark: random.cparagraph(1),
            //
            // address: Mock.mock('@county(true)'),
            // 'age|18-60': 1,
            // 'group|1': ['jiagou', 'yanfa'],
            // birth: random.date(),
            // sex: random.integer(0, 1),
        }));
    }
    return users;
}

export {LoginUsers};
