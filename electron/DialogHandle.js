const {ipcMain, dialog} = require('electron');

ipcMain.handle('dialog:open', async (event, args) => {
    let properties = [];
    if (args.directory) {
        properties.push('openDirectory');
    } else {
        properties.push('openFile');
    }
    if (args.multiple) {
        properties.push('multiSelections');
    }
    let options = {
        title: args.title,
        defaultPath: args.defaultPath,
        properties: properties,
        filters: args.filters
    };
    let dialogReturnValue = await dialog.showOpenDialog(options);
    if (dialogReturnValue.canceled) {
        // 取消，返回空
        return {
            code: true,
            message: '成功',
            data: null
        }
    } else {
        return {
            code: true,
            message: '成功',
            data: dialogReturnValue.filePaths
        }
    }
})