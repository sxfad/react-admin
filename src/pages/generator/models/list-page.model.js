export default {
    initialState: {
        ajaxUrl: {value: void 0},
        routePath: {value: void 0},
        outPutDir: {value: void 0},
        outPutFile: {value: void 0},
        template: {value: 'templates/list-edit-ajax/list.ejs'},
        fields: {value: [{id: 'init-field', title: '', dataIndex: ''}]},
        queryItems: {value: []},
        toolItems: {value: []},
        bottomToolItems: {value: []},

        loading: false,
    },

    syncStorage: {
        ajaxUrl: true,
        routePath: true,
        outPutDir: true,
        outPutFile: true,
        template: true,
        fields: {
            value: [{
                id: true,
                title: true,
                dataIndex: true,
                camelCaseName: true,
                sqlType: true,
                sqlLength: true,
                isNullable: true,
                comment: true,
            }]
        },
        queryItems: {
            value: [{
                id: true,
                field: true,
                label: true,
                type: true,
                camelCaseName: true,
                sqlType: true,
                sqlLength: true,
                length: true,
                isNullable: true,
                comment: true,
            }]
        },
        toolItems: {
            value: [{
                id: true,
                type: true,
                text: true,
                icon: true,
                permission: true,
            }]
        },
        bottomToolItems: {
            value: [{
                id: true,
                type: true,
                text: true,
                icon: true,
                permission: true,
            }]
        },
    },

    setFields: (fields) => ({...fields}),
}
