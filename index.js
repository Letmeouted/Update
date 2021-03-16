/*
 * @Author: Letmeouted
 * @Email: 1002726239@qq.com
 * @FilePath: \Update\index.js
 */
const { app, BrowserWindow, ipcMain } = require("electron");

const { autoUpdater } = require("electron-updater");
let mainWindow;

function creatWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile("index.html");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  autoUpdater.checkForUpdatesAndNotify();
}
app.on("ready", function () {
  creatWindow();
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    creatWindow();
  }
});
ipcMain.on("app_version", (event) => {
  event.sender.send("app_version", {
    version: app.getVersion(),
  });
});
autoUpdater.on("update-available", () => {
  mainWindow.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
  mainWindow.webContents.send("update_downloaded");
});
ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
