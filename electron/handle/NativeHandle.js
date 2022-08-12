const {ipcMain, shell} = require('electron');
const child_process = require('child_process');
const axios = require('axios');
const compressing = require("compressing");

ipcMain.handle('native:invoke:cmd', (event, args) => {
    console.log('native:invoke:cmd');
    console.log(`在目录【${args.currentDir}】下【同步】执行命令【${args.command}】【${args.arg}】`)
    return {
        code: true,
        message: '成功',
        data: child_process.execSync(`"${args.command}" ${args.arg}`, {
            encoding: "utf-8",
            cwd: args.currentDir
        })
    }
});

ipcMain.handle('native:invoke:async', (event, args) => {
    console.log('native:invoke:async');
    console.log(`在目录【${args.currentDir}】下【异步】执行命令【${args.command}】【${args.arg}】`)
    let childProcessWithoutNullStreams = child_process.spawn(args.command, [args.arg], {
        encoding: "utf-8",
        cwd: args.currentDir
    });
    childProcessWithoutNullStreams.stdout.on('data', function (data) {
        console.log(`native:invoke:async:stdout:${args.id}`);
        event.sender.send(`native:invoke:async:stdout:${args.id}`, data);
    });

    childProcessWithoutNullStreams.stderr.on('data', function (data) {
        event.sender.send(`native:invoke:async:stderr:${args.id}`, data);
        console.log(`native:invoke:async:stderr:${args.id}`);
    });

    childProcessWithoutNullStreams.on('exit', function (code) {
        event.sender.send(`native:invoke:async:exit:${args.id}`, code);
        console.log(`native:invoke:async:exit :${args.id}`);
    });
    ipcMain.on(`native:invoke:async:kill:${args.id}`, () => {
        console.log(`native:invoke:async:kill:${args.id}`)
        childProcessWithoutNullStreams.kill(2);
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
});

ipcMain.handle('native:compressing', async (event, args) => {
    console.log('native:compressing');
    let type = args.type;
    if (type === 1) {
        await compressing.tar.uncompress(args.source, args.target, {
            zipFileNameEncoding: 'GBK'
        });
    } else if (type === 2) {
        await compressing.gzip.uncompress(args.source, args.target, {
            zipFileNameEncoding: 'GBK'
        });
    } else if (type === 3) {
        await compressing.tgz.uncompress(args.source, args.target, {
            zipFileNameEncoding: 'GBK'
        });
    } else if (type === 4) {
        await compressing.zip.uncompress(args.source, args.target, {
            zipFileNameEncoding: 'GBK'
        });
    }
    return {
        code: true,
        message: '成功'
    }
});

// 异步命令，直接监听
ipcMain.on('native:invoke:batch', (event, args) => {
    console.log('native:invoke:batch');
    for (let item of args.batch) {
        // 每一个都同步执行
        child_process.execSync(`"${item.command}" ${item.arg}`, {
            encoding: "utf-8",
            cwd: item.dir
        });
    }
    // 全部执行结束，发送完成事件
    console.log(`native:invoke:batch:${args.id}`);
    event.sender.send(`native:invoke:batch:${args.id}`);
});
