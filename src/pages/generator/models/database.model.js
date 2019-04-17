import {ajax} from '@/commons/ajax';

export default {
    initialState: {
        host: {value: 'localhost'},
        port: {value: '3306'},
        user: {value: ''},
        password: {value: ''},
        database: {value: ''},
        table: {value: ''},
        dbType: {value: 'MySql'},

        tableNames: [],
        gettingTableNames: false,

        tableColumns: [],
        gettingTableColumns: false,

        showConfig: true,
    },

    syncStorage: {
        host: true,
        port: true,
        user: true,
        password: true,
        database: true,
        table: true,
        dbType: true,
        tableNames: true,
        tableColumns: true,
    },

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
