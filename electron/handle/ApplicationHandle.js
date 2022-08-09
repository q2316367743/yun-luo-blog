const {ipcMain} = require('electron');

/**
 * 注册应用
 * @param mainWindow window对象
 */
module.exports = function registerApplication(mainWindow) {
    ipcMain.handle('application:openDevTools', (event, args) => {
        console.log('application:openDevTools');
        // 打开开发工具
        mainWindow.webContents.openDevTools();
        return {
            code: true,
            message: '成功'
        }
    })
}

