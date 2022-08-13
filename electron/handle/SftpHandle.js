const {ipcMain} = require('electron');
const Client = require('ssh2-sftp-client');

/**
 * SFTP链接
 *
 */
ipcMain.handle('sftp:upload', async (event, args) => {
    console.log('sftp:upload');
    let sftp = new Client();
    await sftp.connect(args);
    await sftp.uploadDir(args.localDir, args.remoteDir);
    await sftp.end();
    return {
        code: true,
        message: '成功'
    }
})