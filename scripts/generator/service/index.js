const mySqlService = require('./my-sql');
const postgreSQLService = require('./my-sql');

function getDBService(dbType) {
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
