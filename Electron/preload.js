const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ytDownloader', {
  baixarAudio: (url, index) => ipcRenderer.invoke('baixar-audio', url, index)
})
