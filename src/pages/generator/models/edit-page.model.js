export default {
    initialState: {
        ajaxUrl: {value: void 0},
        routePath: {value: void 0},
        outPutDir: {value: void 0},
        outPutFile: {value: void 0},
        template: {value: 'templates/list-edit-ajax/edit.ejs'},
        fields: {value: [{id: 'init-field', title: '', dataIndex: ''}]},

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
                type: true,
                sqlType: true,
                sqlLength: true,
                length: true,
                isNullable: true,
                isRequired: true,
                comment: true,
            }]
        },
    },

    setFields: (fields) => ({...fields}),
}
