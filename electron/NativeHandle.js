const {ipcMain, shell} = require('electron');
const execSync = require('child_process').execSync;

ipcMain.handle('native:invoke', (event, args) => {
    console.log('native:invoke');
    console.log(`在目录【${args.currentDir}】下执行命令【${args.command}】【${args.arg}】`)
    return {
        code: true,
        message: '成功',
        data: execSync(`"${args.command}" ${args.arg}`, {
            encoding: "utf-8",
            cwd: args.currentDir
        })
    }
});

ipcMain.handle('native:openFolder', (event, args) => {
    console.log('native:openFolder', args.path);
    shell.showItemInFolder(args.path);
    return {
        code: true,
        message: '成功'
    }
});

ipcMain.handle('native:openUrl', async (event, args) => {
    console.log('native:openUrl', args.url, args.openWith);
    await shell.openExternal(args.url)
    return {
        code: true,
        message: '成功'
    }
});