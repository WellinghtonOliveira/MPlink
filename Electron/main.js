const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { execFile } = require('child_process')
const fs = require('fs')

const ytDlpPath = path.join(__dirname, 'bin', 'yt-dlp.exe')
const downloadsPath = path.join(__dirname, 'downloads')

if (!fs.existsSync(downloadsPath)) fs.mkdirSync(downloadsPath)

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

ipcMain.handle('baixar-audio', async (event, url, index) => {
  return new Promise((resolve, reject) => {
    const ytDlpPath = path.join(__dirname, 'bin', 'yt-dlp.exe')
    const ffmpegPath = path.join(__dirname, 'bin')
    const outputTemplate = path.join(__dirname, 'downloads', `${index}-%(title)s.%(ext)s`)

    const args = [
      url.trim(),
      '--extract-audio',
      '--audio-format', 'mp3',
      '--ffmpeg-location', ffmpegPath,
      '--restrict-filenames',
      '-o', outputTemplate
    ]

    console.log('\n[DEBUG] yt-dlp path:', ytDlpPath)
    console.log('[DEBUG] args:', args)

    execFile(ytDlpPath, args, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message)
        return
      }

      if (stderr) console.error('[stderr]', stderr)
      if (stdout) console.log('[stdout]', stdout)

      resolve(stdout)
    })
  })
})
