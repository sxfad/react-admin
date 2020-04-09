const mySqlService = require('./my-sql');
const postgreSQLService = require('./postgre-sql.js');

function getDBService(dbType = 'MySql') {
    switch (dbType) {
        case "MySql":
            return mySqlService;
        case "PostgreSQL":
            return postgreSQLService;
        default:
            return mySqlService;
    }
}

module.exports = {
    getDBService,
};
