const {ipcMain} = require('electron');
const Client = require('ssh2-sftp-client');
const fs = require("fs");

function renderConfig(args) {
    let config = {
        host: args.server,
        port: args.port,
        username: args.username,
        tryKeyboard: true
    };
    if (args.connectType === 1) {
        config.password = args.password
    }else {
        config.privateKey = fs.readFileSync(args.privateKey)
    }
    return config;
}

/**
 * SFTP测试
 *
 */
ipcMain.handle('sftp:test', async (_event, args) => {
    console.log('sftp:test')
    console.log(JSON.stringify(renderConfig(args)))
    let sftp = new Client();
    await sftp.connect(renderConfig(args));
    await sftp.end();
    return {
        code: true,
        message: '成功'
    }
})

/**
 * SFTP链接
 *
 */
ipcMain.handle('sftp:upload', async (_event, args) => {
    console.log('sftp:upload');
    let sftp = new Client();
    // 连接
    console.log('连接');
    await sftp.connect(renderConfig(args));
    try {
        // 删除远程目录
        console.log('删除远程目录');
        await sftp.rmdir(args.remoteDir, true);
    }catch (e) {
        // 删除失败无所谓
        console.error(e);
    }
    // 创建远程目录
    console.log('创建远程目录');
    await sftp.mkdir(args.remoteDir, true);
    // 将本地文件上传
    console.log('将本地文件上传');
    await sftp.uploadDir(args.localDir, args.remoteDir);
    // 结束
    console.log('结束');
    await sftp.end();
    return {
        code: true,
        message: '成功'
    }
})