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
    await sftp.connect(renderConfig(args));
    await sftp.uploadDir(args.localDir, args.remoteDir);
    await sftp.end();
    return {
        code: true,
        message: '成功'
    }
})