const fs = require('fs');
const path = require('path');
const program = require('commander');
const chalk = require('chalk');
const getConfig = require('./config');

const DEFAULT_CONFIG_FILE = path.join(__dirname, './config.conf');

program
    .version('0.1.0')
    // .option('-c, --config <file>', 'select a file as config file')
    .parse(process.argv);

let configFile = program.args[0];

if (configFile) {
    configFile = path.join(process.cwd(), configFile);
} else {
    configFile = DEFAULT_CONFIG_FILE;
}

const configFileContent = fs.readFileSync(configFile, 'UTF-8');

async function genFiles() {
    const config = await getConfig(configFileContent);
    config.forEach(cfg => {
        const {filePath, template} = cfg;
        const content = require(template)(cfg);

        writeFileSync(filePath, content);
    });

    return config;
}

genFiles().then(data => {
    data.forEach(({filePath, fileTypeName}) => {
        const index = filePath.indexOf('/src/');
        
        if (index) filePath = filePath.substr(index);

        console.log(chalk.green(`${fileTypeName}: ${filePath}`));
    });
});

/**
 * 写文件，如果目录不存在直接创建
 * @param toFile
 * @param content
 */
function writeFileSync(toFile, content) {
    const sep = path.sep;
    const folders = path.dirname(toFile).split(sep);
    let p = '';
    while (folders.length) {
        p += folders.shift() + sep;
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }

    fs.writeFileSync(toFile, content);
}
