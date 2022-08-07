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
    // TODO: 此处需要处理，目标文件的文件夹不存在
    fs.copyFileSync(source, target);
    return {
        code: true,
        message: '成功'
    }
});

// 文件夹操作

function handleDir(path, arr) {
    let names = fs.readdirSync(path, {
        encoding: "utf-8"
    });
    for (let name of names) {
        let $path = [path, name].join(sep);
        let children = fs.statSync($path).isDirectory();
        arr.push({
            name: name,
            path: $path,
            children: children
        })
        if (children) {
            // 文件夹，递归
            handleDir($path, arr);
        }
    }
}

ipcMain.handle('file:listDir', (event, args) => {
    let targetPath = args.path;
    let recursive = args.recursive;
    let fileName = fs.readdirSync(targetPath, {
        encoding: "utf-8"
    });
    let result = [];
    if (recursive) {
        // 递归
        handleDir(targetPath, result)
    } else {
        // 不递归
        result = fileName.map(name => {
            let $path = [targetPath, name].join(sep);
            return {
                name: name,
                path: $path,
                children: fs.statSync($path).isDirectory()
            }
        });
    }
    return {
        code: true,
        message: '成功',
        data: result
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
    return {
        code: true,
        message: '成功',
        data: args.paths.join(sep)
    };

})

ipcMain.handle('file:exist', (event, args) => {
    console.log('file:exist');
    return {
        code: true,
        message: '成功',
        data: fs.existsSync(args.path)
    };
})

ipcMain.handle('file:rename', (event, args) => {
    console.log('file:rename');
    fs.renameSync(args.oldPath, args.newPath)
    return {
        code: true,
        message: '成功',
        data: true
    };
})

