'use strict';

import { app, protocol, ipcMain } from 'electron';
import App from './App';
const env = import.meta.env;

const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.disableHardwareAcceleration();

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

let mainApp:any = null;
app.on('ready', () => {
  mainApp = new App();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('quit', () => {
  app.quit();
});

ipcMain.on('updateTraySetting', (_, params) => {
  if (mainApp == null) {
    mainApp = new App();
  }
  mainApp.setClockParams(params);
});

// 打开专注模式界面
ipcMain.on('show-focus-window', () => {
  if (mainApp == null) {
    mainApp = new App();
  }
  mainApp.setFullScreen(true);
});

// 关闭专注模式界面
ipcMain.on('hide-focus-window', () => {
  if (mainApp == null) {
    mainApp = new App();
  }
  mainApp.setFullScreen(false).show();
});


if (env.MODE === 'development') {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({default: installExtension, VUEJS3_DEVTOOLS}) => installExtension(VUEJS3_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    }))
    .catch(e => console.error('Failed install extension:', e));
}
