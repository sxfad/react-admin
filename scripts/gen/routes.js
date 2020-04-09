const express = require('express');
const {getTableNames, getTableColumns} = require('./my-sql');
const {COMMON_EXCLUDE_FIELDS} = require('./util');

const router = express.Router();
router.use(require('body-parser').json());

router.get('/gen/tables', async (req, res, next) => {
    const {dbUrl} = req.query;
    const tables = await getTableNames(dbUrl);

    if (tables && tables.length) {
        for (const table of tables) {
            table.columns = await getTableColumns(dbUrl, table.name);
        }
    }

    res.send({tables, ignoreFields: COMMON_EXCLUDE_FIELDS});
});

router.post('/gen/tables', async (req, res, next) => {
    const {tables} = req.body;

    console.log(tables);
    res.send(true);
});
module.exports = router;
