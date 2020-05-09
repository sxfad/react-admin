// 快速push 到git服务器脚本
const {execSync} = require('child_process');
const program = require('commander');
program
    .version(require('./package').version)
    .usage('[options] <file ...>')
    .option('-m, --message <注释>  ', '提交注释')
    .parse(process.argv);

if (!program.message) {
    program.message = '整理代码';
}

execSync(`git add . && git commit -m '${program.message}' && git push origin master `, {stdio: [0, 1, 2]});
