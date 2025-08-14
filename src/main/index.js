// src/main/index.js

import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import fs from 'fs/promises'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { parse } from 'path'


// Проверка и создание settings.json
async function ensureSettingsFile() {
  const userDir = app.getPath('userData')
  const userFile = join(userDir, 'settings.json')
  const defaultFile = join(__dirname, '../renderer/settings.def.json')

  try {
    await fs.access(userFile)
  } catch {
    try {
      const data = await fs.readFile(defaultFile, 'utf-8')
      await fs.mkdir(userDir, { recursive: true })
      await fs.writeFile(userFile, data, 'utf-8')
      console.log('✔ settings.json создан из шаблона.')
    } catch (err) {
      console.error('⛔ Ошибка при создании settings.json:', err)
    }
  }
}

// IPC для работы с настройками
ipcMain.handle('get-settings', async (_event, type) => {
  let file
  if (type === 'default') {
    file = is.dev
      ? join(__dirname, '../renderer/settings.def.json')
      : join(process.resourcesPath, 'app', 'out', 'renderer', 'settings.def.json')
  } else {
    file = join(app.getPath('userData'), 'settings.json')
  }
  const text = await fs.readFile(file, 'utf-8')
  return JSON.parse(text)
})

ipcMain.on('save-settings', async (_event, newSettings) => {
  const file = join(app.getPath('userData'), 'settings.json')
  await fs.writeFile(file, JSON.stringify(newSettings, null, 2), 'utf-8')
})

ipcMain.on('close-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) win.close()
})

ipcMain.on('set-fullscreen', (event, flag) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) win.setFullScreen(!!flag)
})

// Пример: список файлов в папке
ipcMain.handle('list-files', async (_event, folderPath) => {
  try {
    const files = await fs.readdir(folderPath)
    return files
  } catch (e) {
    return []
  }
})

ipcMain.on('set-resolution', (event, resolution) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (win) {
    // Не менять размер, если fullscreen
    if (!win.isFullScreen()) {
      const [w, h] = resolution.split('x').map(Number)
      if (w && h) win.setSize(w, h)
    }
  }
})

async function getInitialSettings() {
  const file = join(app.getPath('userData'), 'settings.json')
  const text = await fs.readFile(file, 'utf-8')
  return JSON.parse(text)
}

async function createWindow() {
  const settings = await getInitialSettings()
  let width = 900, height = 670
  if (settings?.video?.resolution) {
    const [w, h] = String(settings.video.resolution).split('x').map(Number)
    if (w && h) {
      width = w
      height = h
    }
  }
  const fullscreen = !!settings?.video?.fullscreen

  const mainWindow = new BrowserWindow({
    width,
    height,
    fullscreen,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // Открывать DevTools только в dev-режиме
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.webContents.openDevTools({ mode: 'detach' })
    }
  })

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (
      (input.key === 'F12' && input.type === 'keyDown') ||
      (input.control && input.shift && input.key.toLowerCase() === 'i' && input.type === 'keyDown')
    ) {
      mainWindow.webContents.openDevTools({ mode: 'detach' })
      event.preventDefault()
    }
    // Добавить поддержку F5 и Ctrl+R для dev-режима
    if (is.dev && (
      (input.key === 'F5' && input.type === 'keyDown') ||
      (input.control && input.key.toLowerCase() === 'r' && input.type === 'keyDown')
    )) {
      mainWindow.reload()
      event.preventDefault()
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')
  await ensureSettingsFile()
  app.on('browser-window-created', (_, window) => optimizer.watchWindowShortcuts(window))
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})