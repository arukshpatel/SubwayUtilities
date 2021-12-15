import {app , BrowserWindow, screen } from 'electron';
import * as process                   from "process";

const path = require("path");

function createWindow ()
{
    const screenDimensions = screen.getPrimaryDisplay().workArea;

    const mainWindow = new BrowserWindow({
        width: screenDimensions.width,
        height: screenDimensions.height,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
        }
    });

    mainWindow.loadFile('../frontend/index.html');

    mainWindow.webContents.openDevTools();
}

app.whenReady().then(_ => {

    createWindow();

    app.on('activate', function() {

        if(BrowserWindow.getAllWindows().length === 0)
            createWindow();
    })
})

app.on('window-all-closed', function() {

    if(process.platform !== 'darwin')
        app.quit();

})