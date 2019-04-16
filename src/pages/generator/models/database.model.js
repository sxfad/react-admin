import {ajax} from '@/commons/ajax';

export default {
    initialState: {
        host: {value: 'localhost'},
        port: {value: '3306'},
        user: {value: 'liaoyongxiong'},
        password: {value: 'patrick1226'},
        database: {value: 'dianchuang'},
        table: {value: ''},
        dbtype: {value: '2'},

        tableNames: [],
        gettingTableNames: false,

        tableColumns: [],
        gettingTableColumns: false,

        showConfig: true,
    },

    syncStorage: true,

    setFields: (fields) => ({...fields}),

    testConnection: {
        payload: ({params, options} = {}) => ajax.get('/generator/test-connection', params, {baseURL: '', ...options}),
    },

    getTableNames: {
        payload: ({params, options} = {}) => ajax.get('/generator/get-table-names', params, {baseURL: '', ...options}),
        reducer: {
            pending: () => ({gettingTableNames: true}),
            resolve(state, {payload = {}}) {
                return {tableNames: payload};
            },
            complete: () => ({gettingTableNames: false}),
        }
    },

    getTableColumns: {
        payload: ({params, options} = {}) => ajax.get('/generator/get-table-columns', params, {baseURL: '', ...options}),
        reducer: {
            pending: () => ({gettingTableColumns: true}),
            resolve(state, {payload = {}}) {
                return {tableColumns: payload};
            },
            complete: () => ({gettingTableColumns: false}),
        }
    },
}
