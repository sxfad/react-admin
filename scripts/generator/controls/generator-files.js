const path = require('path');
const fs = require('fs');
const {getDirs, generateFile, getFileContent} = require('../utils');

function getFileLevel(filePath) {
    const src = '/src/'; // FIXME 这里是硬编码

    if (!filePath) return './';

    const filePaths = filePath.split(src);

    if (filePaths.length < 2) return './';

    const length = filePaths[1].split('/').length - 1;

    const levels = [];
    for (let i = 0; i < length; i++) {
        levels.push('../');
    }
    return levels.join('');
}

module.exports = {
    generatorFiles(req, res, next) {
        const {baseInfo, listPage, editPage, listEditModel} = req.body;
        const generates = [];

        if (listPage) {
            const outPutFile = path.resolve(listPage.outPutDir, listPage.outPutFile);
            const fileLevel = getFileLevel(outPutFile);
            const config = {
                ...baseInfo,
                ...listPage,
                outPutFile,
                fileLevel,
                editPageRoutePath: editPage ? editPage.routePath : `${listPage.routePath}/+edit`,
            };
            generates.push(generateFile(config));
        }

        if (editPage) {
            const outPutFile = path.resolve(editPage.outPutDir, editPage.outPutFile);
            const fileLevel = getFileLevel(outPutFile);
            const config = {
                ...baseInfo,
                ...editPage,
                outPutFile,
                fileLevel,
                listPageRoutePath: listPage ? listPage.routePath : `/${baseInfo.name}`
            };
            generates.push(generateFile(config));
        }

        if (listEditModel) {
            const outPutFile = path.resolve(listEditModel.outPutDir, listEditModel.outPutFile);
            const fileLevel = getFileLevel(outPutFile);

            const config = {
                ...listEditModel,
                ajaxUrl: listPage ? listPage.ajaxUrl : editPage.ajaxUrl,
                outPutFile,
                fileLevel,
            };
            generates.push(generateFile(config));
        }

        Promise.all(generates).then(() => {
            res.send(true);
        });
    },

    getFileContent(req, res, next) {
        const {baseInfo, pageInfo} = req.body;
        const outPutFile = path.resolve(pageInfo.outPutDir, pageInfo.outPutFile);
        const fileLevel = getFileLevel(outPutFile);

        const editPageRoutePath = `${pageInfo.routePath}/+edit`;
        const listPageRoutePath = `/${baseInfo.name}`;
        const ajaxUrl = `/${baseInfo.name}`;

        const config = {
            ...baseInfo,
            ...pageInfo,
            outPutFile,
            fileLevel,

            editPageRoutePath,
            listPageRoutePath,
            ajaxUrl,
        };

        getFileContent(config)
            .then(content => res.send(content));
    },

    getSrcDirs(req, res, next) {
        const dirs = getDirs();
        if (dirs && dirs.children) {
            res.send(dirs.children);
            return;
        }
        res.send([]);
    },

    checkFileExist(req, res, next) {
        const {files} = req.query;
        const result = [];

        files.forEach(item => {
            const {fileDir, fileName} = JSON.parse(item);
            const file = path.resolve(fileDir, fileName);
            const exist = fs.existsSync(file);
            result.push({
                fileName,
                exist,
            });
        });

        res.send(result);
    },
};
