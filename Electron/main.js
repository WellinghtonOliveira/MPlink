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
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // importante
      nodeIntegration: false, // segurança
      enableRemoteModule: false
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

// Extrai o título do vídeo
ipcMain.handle('extrair-titulo', async (event, url) => {
  return new Promise((resolve, reject) => {
    const args = ['--dump-json', url.trim()]

    execFile(ytDlpPath, args, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message)
        return
      }

      try {
        const info = JSON.parse(stdout)
        resolve(info.title)
      } catch (e) {
        reject('Erro ao interpretar JSON: ' + e.message)
      }
    })
  })
})

// Faz o download do áudio (com Promise controlada)
ipcMain.handle('baixar-audio', async (event, { url, qualidade }) => {
  return new Promise((resolve, reject) => {
    const ffmpegPath = path.join(__dirname, 'bin')
    const outputTemplate = path.join(downloadsPath, `%(title)s.%(ext)s`)

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

    const processo = execFile(ytDlpPath, args, { windowsHide: true })

    let saida = ''

    processo.stdout.on('data', data => {
      saida += data.toString()
    })

    processo.stderr.on('data', data => {
      console.log('[yt-dlp stderr]', data.toString())
    })

    processo.on('close', code => {
      if (code === 0) {
        resolve(saida)
      } else {
        reject(`yt-dlp finalizou com código ${code}`)
      }
    })

    processo.on('error', err => reject(err))
  })
})
