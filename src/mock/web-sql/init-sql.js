import moment from 'moment';

const now = moment().format('YYYY-MM-DD HH:mm:ss');

export default `
    create table if not exists menus
    (
        id        INTEGER PRIMARY KEY,
        parentId  INTEGER                             null,
        enabled    tinyint(1)                          not null, -- comment '是否可用',
        title     varchar(50)                         null,     -- comment '菜单标题或者权限码标题',
        icon      varchar(50)                         null,     -- comment '菜单图标',
        basePath  varchar(200)                        null,     -- comment '基础路径',
        path      varchar(200)                        null,     -- comment '菜单路径',
        target    varchar(50)                         null,     -- comment '目标：menu 应用菜单 qiankun 乾坤子项目 iframe 内嵌iframe _self 当前窗口打开第三方 _blank 新开窗口打开第三方',
        \`order\` INTEGER   default 0                 null,     -- comment '排序，越大越靠前',
        type      INTEGER   default 1                 not null, -- comment '类型： 1 菜单 2 权限码',
        code      varchar(50)                         null,     -- comment '权限码',
        name      varchar(50)                         null,     -- comment '乾坤子应用注册名',
        entry     varchar(200)                        null,     -- comment '乾坤子应用入口地址',
        createdAt timestamp default CURRENT_TIMESTAMP not null, -- comment '创建时间',
        updatedAt timestamp default CURRENT_TIMESTAMP null,     -- comment '更新时间',
        constraint menus_id_uindex
            unique (id)
    );

    create table if not exists role_menus
    (
        id        INTEGER PRIMARY KEY,
        roleId    INTEGER                             not null,
        menuId    INTEGER                             not null,
        createdAt timestamp default CURRENT_TIMESTAMP not null,
        updatedAt timestamp default CURRENT_TIMESTAMP not null,
        constraint role_menus_id_uindex
            unique (id)
    );

    create table if not exists user_menus
    (
        id        INTEGER PRIMARY KEY,
        userId    INTEGER                             not null,
        menuId    INTEGER                             not null,
        createdAt timestamp default CURRENT_TIMESTAMP not null,
        updatedAt timestamp default CURRENT_TIMESTAMP not null,
        constraint role_menus_id_uindex
            unique (id)
    );

    create table if not exists roles
    (
        id        INTEGER PRIMARY KEY,
        name      varchar(50)                         not null, -- comment '角色名称',
        enabled    tinyint(1)                          not null, -- comment '是否可用',
        remark    varchar(200)                        null,     -- comment '角色备注',
        type      tinyint(1)                          not null, -- comment '角色类型，1 超级管理员 2 子系统管理员 3 用户自定义角色',
        systemId  INTEGER,                                      -- comment '归属系统id（菜单顶级id）',
        createdAt timestamp default CURRENT_TIMESTAMP not null, -- comment '创建时间',
        updatedAt timestamp default CURRENT_TIMESTAMP null,     -- comment '更新时间',
        constraint roles_id_uindex
            unique (id)
    );

    create table if not exists user_roles
    (
        id        INTEGER PRIMARY KEY,
        userId    INTEGER                             not null,
        roleId    INTEGER                             not null,
        createdAt timestamp default CURRENT_TIMESTAMP not null,
        updatedAt timestamp default CURRENT_TIMESTAMP not null,
        constraint user_roles_id_uindex
            unique (id)
    );

    create table if not exists users
    (
        id        INTEGER PRIMARY KEY,
        account   varchar(50)                         not null, -- comment '账号',
        name      varchar(50)                         not null, -- comment '用户名',
        password  varchar(20)                         null,     -- comment '密码',
        mobile    varchar(20)                         null,     -- comment '电话',
        email     varchar(50)                         null,     -- comment '邮箱',
        enabled    tinyint(1)                          not null, -- comment '是否可用',
        createdAt timestamp default CURRENT_TIMESTAMP not null, -- comment '创建时间',
        updatedAt timestamp default CURRENT_TIMESTAMP not null,
        constraint users_account_uindex
            unique (account),
        constraint users_id_uindex
            unique (id)
    );
`;

export const initRolesSql = `
    INSERT INTO roles (id, name, remark, enabled, type, createdAt, updatedAt)
    VALUES (1, '超级管理员', '拥有系统所有权限', 1, 1, '${now}', '${now}');
    INSERT INTO roles (id, name, remark, enabled, type, systemId, createdAt, updatedAt)
    VALUES (2, '系统管理员', '拥有当前系统所有权限', 1, 2, 1, '${now}', '${now}');
`;

export const initRoleMenusSql = `
`;

export const initUsersSql = `
    INSERT INTO users (id, account, name, password, mobile, email, enabled, createdAt, updatedAt)
    VALUES (1, 'admin', '超级管理员', '123456', '18888888888', 'email@qq.com', 1, '${now}', '${now}');
`;

export const initUserRolesSql = `
    INSERT INTO user_roles (id, userId, roleId, createdAt, updatedAt)
    VALUES (1, 1, 1, '${now}', '${now}');
`;

export const initMenuSql = `
    INSERT INTO menus (id, parentId, enabled, title, icon, basePath, path, target, \`order\`, type, code, name, entry, createdAt, updatedAt)
    VALUES (1, null, 1, '系统管理', null, null, null, 'menu', 0, 1, null, null, null, '${now}', '${now}');
    INSERT INTO menus (id, parentId, enabled, title, icon, basePath, path, target, \`order\`, type, code, name, entry, createdAt, updatedAt)
    VALUES (2, 1, 1, '用户管理', null, null, '/users', 'menu', 0, 1, null, null, null, '${now}', '${now}');
    INSERT INTO menus (id, parentId, enabled, title, icon, basePath, path, target, \`order\`, type, code, name, entry, createdAt, updatedAt)
    VALUES (3, 1, 1, '角色管理', null, null, '/roles', 'menu', 0, 1, null, null, null, '${now}', '${now}');
    INSERT INTO menus (id, parentId, enabled, title, icon, basePath, path, target, \`order\`, type, code, name, entry, createdAt, updatedAt)
    VALUES (4, 1, 1, '菜单管理', null, null, '/menus', 'menu', 0, 1, null, null, null, '${now}', '${now}');
    INSERT INTO menus (id, parentId, enabled, title, icon, basePath, path, target, \`order\`, type, code, name, entry, createdAt, updatedAt)
    VALUES (5, 2, 1, '添加用户', null, null, null, null, 0, 2, 'ADD_USER', null, null, '${now}', '${now}');
    INSERT INTO menus (id, parentId, enabled, title, icon, basePath, path, target, \`order\`, type, code, name, entry, createdAt, updatedAt)
    VALUES (6, 2, 1, '删除用户', null, null, null, null, 0, 2, 'UPDATE_USER', null, null, '${now}', '${now}');
`;

export const initDataSql = {
    menus: initMenuSql,
    roles: initRolesSql,
    users: initUsersSql,
    role_menus: initRoleMenusSql,
    user_roles: initUserRolesSql,
};
