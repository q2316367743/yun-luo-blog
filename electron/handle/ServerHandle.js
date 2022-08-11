const {ipcMain} = require('electron');
const http = require('http');
const fs = require('fs');
const {sep} = require('path');

let fileServer;

ipcMain.handle('server:start', (event, args) => {
    console.log('server:start');
    // 启动文件服务器
    fileServer = http.createServer(function (req, res) {
        let url = req.url;
        if (sep !== "/"){
            url = url.replaceAll("/", sep);
        }
        let file = args.serverDir + url;
        console.log(url);
        console.log(file);
        if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
            if (file.endsWith("\\")) {
                file = file + 'index.html';
            } else {
                file = file + '\\index.html';
            }
        }
        console.log(file);
        fs.readFile(file, function (err, data) {
            if (err) {
                res.writeHeader(404, {
                    'content-type': 'text/html;charset="utf-8"'
                });
                res.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
                res.end();
            } else {
                if (file.endsWith("html")) {
                    res.writeHeader(200, {
                        'content-type': 'text/html;charset="utf-8"'
                    });
                }
                res.write(data);
                res.end();

            }

        });
    }).listen(8888);
    return {
        code: true,
        message: '成功'
    }
});

ipcMain.handle("server:stop", (event, args) => {
    console.log('server:stop');
    // 停止
    if (fileServer) {
        // 停止
        fileServer.close((e) => {
            console.log('server:error:1');
            event.sender.send('server:error', e);
        })
    } else {
        console.log('server:error:2');
        event.sender.send('server:error', '服务未启动');
    }
    return {
        code: true,
        message: '成功'
    }
})

