const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  extrairTitulo: (url) => ipcRenderer.invoke('extrair-titulo', url),
  baixarAudio: (url, index) => ipcRenderer.invoke('baixar-audio', url, index)
})
