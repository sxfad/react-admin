const fs = require('fs');
const path = require('path');
const program = require('commander');
const inquirer = require('inquirer');
const {logSuccess, writeFileSync} = require('./util');
const getConfig = require('./config');

const DEFAULT_CONFIG_FILE = path.join(__dirname, './config.conf');

program
    .version('0.1.0')
    .option('-y, --yes', '忽略覆盖文件提示')
    .parse(process.argv);

let configFile = program.args[0];

const ignoreTip = program.yes;

if (configFile) {
    configFile = path.join(process.cwd(), configFile);
} else {
    configFile = DEFAULT_CONFIG_FILE;
}

const configFileContent = fs.readFileSync(configFile, 'UTF-8');

async function genFiles() {
    const config = await getConfig(configFile, configFileContent);
    const successFile = [];

    for (let cfg of config) {
        let {filePath, template, fileTypeName} = cfg;
        const fp = filePath.replace(process.cwd(), '');
        const content = require(template)(cfg);

        if (fs.existsSync(filePath)) {
            const ok = ignoreTip ? true : await prompt(`${filePath.replace(process.cwd(), '')} 文件已存在，是否覆盖？`);
            if (ok) {
                writeFileSync(filePath, content);

                successFile.push({name: fileTypeName, path: fp});
            }
        } else {
            writeFileSync(filePath, content);

            successFile.push({name: fileTypeName, path: fp});
        }
    }

    if (successFile && successFile.length) {
        console.log();
        logSuccess('成功生成文件：');
        successFile.forEach(item => {
            const {name, path} = item;

            logSuccess(`${name}: ${path}`);
        });
    }

    return config;
}

async function prompt(message) {
    return inquirer.prompt([{
        type: 'confirm',
        message: message,
        name: 'ok',
    }]).then(function (answers) {
        return answers.ok;
    });
}

genFiles();
