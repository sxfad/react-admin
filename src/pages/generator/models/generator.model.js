import {ajax} from '@/commons/ajax';

export default {
    initialState: {
        loading: false,
        srcDirectories: [],
        pagesDirectories: [],
    },

    generatorFiles: {
        payload: ({params, options} = {}) => ajax.post('/generator/generator-files', params, {baseURL: '', ...options}),
        reducer: {
            pending: () => ({loading: true}),
            complete: () => ({loading: false}),
        }
    },

    getFileContent: {
        payload: ({params, options} = {}) => ajax.post('/generator/get-file-content', params, {baseURL: '', ...options}),
    },

    getSrcDirs: {
        payload: ({params, options} = {}) => ajax.get('/generator/get-src-dirs', params, {baseURL: '', ...options}),
        reducer: {
            pending: () => ({loading: true}),
            resolve(state, {payload = []}) {
                const pagesDirectories = payload.filter(item => item.title === 'pages')
                return {srcDirectories: payload, pagesDirectories};
            },
            complete: () => ({loading: false}),
        }
    },


    checkFileExist: {
        payload: ({params, options} = {}) => ajax.get('/generator/check-file-exist', params, {baseURL: '', ...options}),
    }
}
