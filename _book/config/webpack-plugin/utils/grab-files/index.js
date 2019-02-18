const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const globby = require('globby');

class GrabFiles {
    constructor(options) {
        let {paths, ignored = [], content = false, displayLog = false} = options;

        if (typeof paths === 'string') paths = [paths];

        this.paths = paths;
        this.ignored = ignored;
        this.content = content;
        this.displayLog = displayLog;
    }

    /**
     * 启用监控
     * @param cb
     */
    watch(cb) {
        const {paths, ignored, displayLog} = this;

        if (displayLog) console.log('watching:');

        let result = [];

        // 截流，指定时间内只触发一次cb，提高cb执行性能，主要解决第一次调用watch是，event === add ，cb会被调用多次
        let st;

        function callback(result, event) {
            clearTimeout(st);
            st = setTimeout(function () {
                cb(result, event);
            }, 0);
        }

        chokidar.watch(paths.map(item => item.replace(/\\/gm, '/')), {ignored}).on('all', (event, pathName) => {
            if (displayLog) console.log(event, pathName);

            if (event === 'add') {
                const re = this.grab(pathName);
                result.push(re);

                callback(result, event, pathName);
            }

            if (event === 'change') {
                const existRe = result.find(item => item.path === pathName);
                if (existRe) {
                    const re = this.grab(pathName);
                    existRe.path = re.path;
                    existRe.content = re.content;
                    existRe.fileName = re.fileName;
                    existRe.baseName = re.baseName;

                    callback(result, event, pathName);
                }
            }

            if (event === 'unlink') {
                result = result.filter(item => item.path !== pathName);

                callback(result, event, pathName);
            }
        });
    }

    /**
     * 获取结果
     * @returns {Array}
     */
    getResult() {
        const {paths, ignored, displayLog} = this;

        const files = globby.sync(paths, {ignore: ignored, absolute: true});
        const result = [];

        if (files && files.length) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                result.push(this.grab(file));
            }
        }

        if (displayLog) {
            console.log(`find ${result.length} files:`);

            result.forEach(function (item) {
                console.log(item.path);
            });
        }

        return result;
    }

    /**
     * 抓取某个文件信息
     * @param filePath
     * @returns {*}
     */
    grab(filePath) {
        if (!fs.existsSync(filePath)) return false;

        const baseName = path.basename(filePath);
        let fileName = baseName.replace(path.extname(filePath), '');

        const {content} = this;
        let fileStr;

        // 需要内容，进行文件读取
        if (content) {
            fileStr = fs.readFileSync(filePath, 'UTF-8');
        }

        return {path: filePath, content: fileStr, fileName, baseName};
    }
}

module.exports = GrabFiles;
