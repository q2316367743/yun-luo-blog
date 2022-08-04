const {ipcMain} = require('electron');
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
})