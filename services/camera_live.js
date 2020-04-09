const child_process = require('child_process');
const options = {
    cwd: undefined,
    env: process.env,
    stdio: 'inherit'
};
const {tasks} = require('./taskstatus');
const {rtspToRtmp} = require('../config/ffmpegTasks');

module.exports = {
    createWorker: function(command) {
        const worker =  child_process.spawn('ffmpeg', command, options);

        // 退出时重新启动进程
        worker.on('exit', () => {
            console.log('Worker ' + worker.pid + 'exited');
            const command = tasks[worker.pid]['command'];
            delete tasks[worker.pid];
            this.createWorker(command);
        });

        worker.on('error', function() {
            console.log("直播子进程发生错误");
        });

        worker.on('close', function(code, signal){
            //console.log('close', code, signal);
            console.log("直播子进程退出! 退出码为：" + code);
        });

        tasks[worker.pid] = {
            worker: worker,
            command: command
        };

        if(worker.pid) {
            console.log('创建的直播子进程的pid为：' + worker.pid);
        }
    },
    loadTasks: function () {
        for(let i = 0; i < rtspToRtmp.length; i++) {
            const cmdList = this.createCMD(rtspToRtmp[i].source, rtspToRtmp[i].target);
            this.createWorker(cmdList);
        }
    },
    createCMD: function(source, target) {
        return ['-i', source, '-c:v', 'libx264', '-c:a', 'aac', '-s', '320x240', '-b', '1000k', '-r', '15', '-f', 'flv', target];
    }
};
