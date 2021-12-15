import Mock from 'mockjs';

export function getRolesByPageSize(pageSize) {
    const users = [];
    for (let i = 0; i < pageSize; i++) {
        users.push(
            Mock.mock({
                id: Mock.Random.guid(),
                name: Mock.Random.cname(),
                description: Mock.Random.cparagraph(1),
            }),
        );
    }
    return users;
}
