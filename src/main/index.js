import { app, shell, BrowserWindow, globalShortcut, Tray, Menu, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { exec, spawn } from 'child_process'
import iconv from 'iconv-lite'
import axios from 'axios'
import FormData from 'form-data'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 150,
    autoHideMenuBar: true,
    movable: true,
    closable: false,
    minimizable: false,
    maximizable: false,
    title: 'incoming call',
    resizable: false, //
    y: 870,
    x: 1410,
    alwaysOnTop: true,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      webSecurity: false,
      sandbox: false
    }
  })

  let currentSupportStatus = ''
  let exePath = ''
  let currentSession = ''

  // eslint-disable-next-line no-unused-vars
  let microSipPromise = new Promise((resolve, reject) => {
    let isDialogOnceShown = false
    if (currentSupportStatus !== 'online') {
      let mpChanges = setInterval(() => {
        let findPath = spawn('powershell.exe', [
          'get-process microsip | select-object -ExpandProperty Path'
        ]) // find MicroSip path
        findPath.stdout.once('data', (data) => {
          exePath = iconv.decode(data, '866')
          currentSupportStatus = 'online'
          mainWindow.webContents.send('supportStatusHandler', currentSupportStatus)
          resolve('online')
          clearInterval(mpChanges)
        })
        findPath.stderr.once('data', () => {
          currentSupportStatus = 'offline'
          if (!isDialogOnceShown) {
            dialog
              .showMessageBox({ message: 'Запустите MicroSip', type: 'warning', title: 'Warning!' })
              .then((isDialogOnceShown = true))
          }
          mainWindow.webContents.send('supportStatusHandler', currentSupportStatus)
          resolve('offline')
        })
      }, 2000)
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  globalShortcut.unregister('f5')

  let tray = null
  tray = new Tray(join(__dirname, '../../resources/icon.png'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Развернуть',
      type: 'normal',
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: 'Рестарт',
      type: 'normal',
      click: () => {
        mainWindow.reload()
      }
    },
    {
      label: 'Выйти',
      type: 'normal',
      click: () => {
        app.exit()
      }
    }
  ])
  tray.setToolTip('Tech')
  tray.setContextMenu(contextMenu)
  tray.addListener('click', () => {
    mainWindow.show()
  })

  ipcMain.on('appHide', () => {
    mainWindow.hide()
  })

  ipcMain.on('openUrl', (event, url) => {
    shell.openExternal(url)
  })

  ipcMain.on('executeCmd', (event, cmd_command) => {
    exec(`${JSON.stringify(exePath.trim())} /${cmd_command}`)
  })

  ipcMain.on('appShow', () => {
    mainWindow.show()
  })

  ipcMain.on('auth', (event, login, pwd) => {
    axios({
      url: 'https://tools.t2tc.ru/bpms/engine/get_profile.php',
      method: 'GET',
      auth: {
        username: login,
        password: pwd
      },
      headers: { 'Cache-Control': 'max-age=0' }
    })
      .catch((error) => {
        dialog.showMessageBox({
          message: error.response.data.error.description,
          title: 'Ошибка авторизации',
          type: 'error'
        })
      })
      .then((response) => {
        currentSession = response.headers['set-cookie']
          .find((cookie) => cookie.includes('BPMS_SESSION'))
          .split(';')[0]
        mainWindow.webContents.send('accountData', response.data)
      })
  })

  ipcMain.on('callerCard', (event, number) => {
    let formedData = new FormData()
    let item = { process_name: number, lead: 1, template: '86' }
    for (let key in item) {
      formedData.append(key, item[key])
    }

    axios({
      url: 'https://tools.t2tc.ru/bpms/engine/get_processes.php',
      method: 'POST',
      data: formedData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: currentSession
      }
    })
      .then((response) => response.data)
      .then((data) => {
        if (data.result.rows) {
          shell.openExternal(
            `https://tools.t2tc.ru/bpms/process.html?id=${data.result.rows[0].process_id}`
          )
        } else {
          axios({
            url: `https://tools.t2tc.ru/bpms/engine/create_process.php?template_name=Консультация&process_name=${number}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Cookie: currentSession
            }
          }).then((response) => {
            shell.openExternal(`https://tools.t2tc.ru/bpms/process.html?id=${response.data.result}`)
          })
        }
      })
  })
}

app.whenReady().then(() => {
  installExtension(VUEJS_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err))

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS, it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
