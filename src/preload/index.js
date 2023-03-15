import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('tintacle', {
      collapseToTray: () => {
        ipcRenderer.send('appHide')
      },
      openExternalLink(url) {
        ipcRenderer.send('openUrl', url)
      },
      callCmd(cmd_command) {
        ipcRenderer.send('executeCmd', cmd_command)
      },
      appShow() {
        ipcRenderer.send('appShow')
      },
      supportStatusHandler: (callback) => ipcRenderer.on('supportStatusHandler', callback),
      async auth(login, pwd) {
        await ipcRenderer.send('auth', login, pwd)
      },
      getAccountData: (callback) => ipcRenderer.on('accountData', callback),
      async openCallerCard(number) {
        await ipcRenderer.send('callerCard', number)
      },
      callerCardHandler: (callback) => ipcRenderer.on('callerCardHandler', callback)
    })
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
