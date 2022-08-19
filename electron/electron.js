// electron/electron.js
const path = require('path');
const {app, BrowserWindow, Menu} = require('electron');
require('./handle/FileHandle');
require('./handle/NativeHandle');
require('./handle/DialogHandle');
require('./handle/ServerHandle');
require('./handle/SftpHandle');
const registerApplication = require('./handle/ApplicationHandle');

const isDev = process.env.IS_DEV === "true";
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function createWindow() {
    // null值取消顶部菜单栏
    Menu.setApplicationMenu(null);
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        title: '云落博客',
        icon: path.join(__dirname, 'assets', 'ico', '128.ico'),
        width: 1210,
        height: 710,
        minWidth: 1210,
        minHeight: 710,
        webPreferences: {
            nodeIntegration: true,
            // 官网似乎说是默认false，但是这里必须设置contextIsolation
            contextIsolation: false,
            preload: path.join(__dirname, "preload.js"),
            webSecurity: false,
            allowRunningInsecureContent: false,
        },
    });

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:5173'
            : `file://${path.join(__dirname, '../dist/index.html')}`
    ).then(() => {
        console.log("创建成功");
    });
    // 打开开发者工具
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
    // 注册应用工具
    registerApplication(mainWindow);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});