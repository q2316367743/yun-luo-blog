const {ipcMain, shell} = require('electron');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
const axios = require('axios');

ipcMain.handle('native:invoke:cmd', (event, args) => {
    console.log('native:invoke:cmd');
    console.log(`在目录【${args.currentDir}】下【同步】执行命令【${args.command}】【${args.arg}】`)
    return {
        code: true,
        message: '成功',
        data: execSync(`"${args.command}" ${args.arg}`, {
            encoding: "utf-8",
            cwd: args.currentDir
        })
    }
});

ipcMain.handle('native:invoke:async', (event, args) => {
    console.log('native:invoke:async');
    console.log(`在目录【${args.currentDir}】下【异步】执行命令【${args.command}】【${args.arg}】`)
    exec(`"${args.command}" ${args.arg}`, {
        encoding: "utf-8",
        cwd: args.currentDir
    })
    return {
        code: true,
        message: '成功'
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

ipcMain.handle('native:http', async (event, args) => {
    console.log('native:http');
    let axiosResponse = await axios(args);
    return {
        code: true,
        message: '成功',
        data: axiosResponse.data
    }
})