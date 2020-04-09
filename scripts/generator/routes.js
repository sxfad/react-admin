/*
 * 路由映射文件,配置越靠前，优先级越高
 * */
const express = require('express');


const router = express.Router();
router.use(require('body-parser').json());
const {
    generatorFiles,
    getSrcDirs,
    checkFileExist,
    getFileContent,
} = require('./controls/generator-files');

const {
    testConnection,
    getTableNames,
    getTableColumns,
} = require('./controls/database-info');


router.post('/generator/generator-files', generatorFiles);
router.get('/generator/get-src-dirs', getSrcDirs);
router.get('/generator/check-file-exist', checkFileExist);
router.post('/generator/get-file-content', getFileContent);
router.get('/generator/test-connection', testConnection);
router.get('/generator/get-table-names', getTableNames);
router.get('/generator/get-table-columns', getTableColumns);

module.exports = router;
