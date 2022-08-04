const {ipcMain} = require('electron');
const fs = require('fs');
const {sep} = require('path');

// 文件操作

ipcMain.handle('file:readFile', (event, args) => {
    console.log('file:readFile');
    let path = args.path;
    return {
        code: true,
        message: '成功',
        data: fs.readFileSync(path, {
            encoding: "utf-8",
            flag: "r"
        })
    }
});

ipcMain.handle('file:writeFile', (event, args) => {
    console.log('file:writeFile');
    fs.writeFileSync(args.path, args.content, {
        encoding: "utf-8",
    })
    return {
        code: true,
        message: '成功'
    }
});

ipcMain.handle('file:removeFile', (event, args) => {
    console.log('file:removeFile');
    fs.unlinkSync(args.path)
    return {
        code: true,
        message: '成功'
    }
});

ipcMain.handle('file:copyFile', (event, message) => {
    console.log('file:copyFile');
    // 拷贝文件
    let source = message.source;
    let target = message.target;
    console.log(source, '---', target)
    fs.copyFileSync(source, target)
    return {
        code: true,
        message: '成功'
    }
});

// 文件夹操作

ipcMain.handle('file:listDir', (event, args) => {
    let targetPath = args.path;
    let recursive = args.recursive;
    let fileName = fs.readdirSync(targetPath, {
        encoding: "utf-8"
    });
    return {
        code: true,
        message: '成功',
        data: fileName.map(name => {
            let $path = [targetPath, name].join(sep);
            return {
                name: name,
                path: $path,
                children: fs.statSync($path).isDirectory()
            }
        })
    }
});

ipcMain.handle('file:createDir', (event, message) => {
    console.log('file:createDir');
    fs.mkdirSync(message.path, {
        recursive: message.recursive && message.recursive === true
    })
    return {
        code: true,
        message: '成功'
    }
});

ipcMain.handle('file:removeDir', (event, message) => {
    console.log('file:removeDir');
    fs.rmdirSync(message.path, {
        recursive: message.recursive && message.recursive === true
    })
    return {
        code: true,
        message: '成功'
    }
});

// 杂项

ipcMain.handle('file:defaultDir', () => {
    console.log('file:defaultDir');
    console.log(process.env.HOMEPATH)
    return {
        code: true,
        message: '成功',
        data: process.env.USERPROFILE
    };
});

ipcMain.handle('file:resolve', (event, args) => {
    console.log('file:resolve');
    console.log(args.paths.join(sep))
    return {
        code: true,
        message: '成功',
        data: args.paths.join(sep)
    };

})

