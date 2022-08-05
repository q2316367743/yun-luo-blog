const {ipcMain} = require('electron');
const Client = require('ssh2-sftp-client');

/**
 * SFTP上传
 *
 */
ipcMain.handle('ssh:sftp', async (event, args) => {
    let sftp = new Client();
    await sftp.connect(args);
    await sftp.uploadDir(args.localDir, args.remoteDir);
    await sftp.end();
    return {
        code: true,
        message: '成功'
    }
})