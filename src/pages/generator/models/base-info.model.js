export default {
    initialState: {
        name: {value: ''},
        chineseName: {value: ''},
        lowercaseName: {value: ''},
        capitalName: {value: ''},
        allCapitalName: {value: ''},
        pluralityName: {value: ''},
        permissionPrefix: {value: ''},
        showMore: false,
    },

    syncStorage: true,

    setFields: (fields) => ({...fields}),
}
