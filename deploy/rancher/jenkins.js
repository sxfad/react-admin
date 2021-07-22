const fs = require('fs');
const path = require('path');
const appName = require(path.join(__dirname, '..', '..', 'package.json')).name;

// if (appName === 'react-admin') throw Error('请修改package.json中name属性，当前为「react-admin」');

const BASE_URL = 'http://wang_sb:wang2018@172.16.175.93:8080/jenkins';
const JOB_NAME = appName;
const GIT_URL = getGitUrl(); // 'https://gitee.com/sxfad/react-admin.git';
const BRANCH = 'master';
const NAME_SPACE = 'front-center';
const FRONT_FOLDER = '.';

const jenkins = require('jenkins')({
    baseUrl: BASE_URL,
    crumbIssuer: true,
    promisify: true,
});


(async () => {
    // 不存在，创建任务
    const exist = await jenkins.job.exists(JOB_NAME);
    if (!exist) {
        await createJob({
            jobName: JOB_NAME,
            gitUrl: GIT_URL,
            branch: BRANCH,
            nameSpace: NAME_SPACE,
            fontFolder: FRONT_FOLDER,
        });
        console.log('create job', JOB_NAME);
    }

    // 构建并输出日志
    const queueNumber = await jenkins.job.build(JOB_NAME);
    const buildNumber = await getBuildNumber(queueNumber);

    console.log('build number', buildNumber);

    showLog(JOB_NAME, buildNumber);
})();

/**
 * 获取构建序号
 * @param queueNumber
 * @returns {Promise<unknown>}
 */
async function getBuildNumber(queueNumber) {
    return new Promise((resolve, reject) => {
        const si = setInterval(async () => {
            const res = await jenkins.queue.item(queueNumber);
            if (!res.executable) {
                console.log(res.why);
            } else {
                resolve(res.executable.number);
                clearInterval(si);
            }
        }, 2000);

        setTimeout(() => {
            clearInterval(si);
            reject(new Error('timeout'));
        }, 1000 * 20);
    });
}

/**
 * 显示日志
 * @param jobName
 * @param buildNumber
 */
function showLog(jobName, buildNumber) {
    const log = jenkins.build.logStream(jobName, buildNumber);

    log.on('data', function(text) {
        process.stdout.write(text);
    });

    log.on('error', function(err) {
        console.log('error', err);
    });

    log.on('end', function() {
        console.log('end');
    });
}

// 获取配置xml
// async function getConfig(jobName) {
//     const res = await jenkins.job.config(jobName);
//
//     return res;
// }

/**
 * 获取任务配置文件
 * @param options
 * @returns {*}
 */
function getConfigXml(options = {}) {
    const {
        gitUrl,
        branch = 'master',
        nameSpace = 'front-center',
        fontFolder = '.',
    } = options;

    if (!gitUrl) throw Error('git 地址不能为空！');

    const xmlTemplate = fs.readFileSync(path.join(__dirname, 'job.xml'), 'UTF-8');

    return xmlTemplate
        .replace('<url>https://gitee.com/sxfad/react-admin.git</url>', `<url>${gitUrl}</url>`)
        .replace('<name>*/master</name>', `<name>*/${branch}</name>`)
        .replace('/NAMESPACE_NAME/front-center', `/NAMESPACE_NAME/${nameSpace}`)
        .replace('cd .', `cd ${fontFolder}`);
}

/**
 * 创建任务
 * @param options
 * @returns {Promise<jobName>}
 */
async function createJob(options) {
    const {jobName, ...others} = options;

    const xml = getConfigXml(others);

    return jenkins.job.create(jobName, xml);
}

/**
 * 获取当前项目的git仓库地址
 * @returns {*}
 */
function getGitUrl() {
    const gitConfigPath = path.join(__dirname, '..', '..', '.git', 'config');
    const configContent = fs.readFileSync(gitConfigPath, 'UTF-8');

    const arr = configContent.split('\n\t');
    const url = arr.find(item => item.startsWith('url = '));
    return url.replace('url = ', '');
}
