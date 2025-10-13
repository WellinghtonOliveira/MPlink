const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  extrairTitulo: (url) => ipcRenderer.invoke('extrair-titulo', url),
  baixarAudio: (url, qualidade) => ipcRenderer.invoke('baixar-audio', { url, qualidade })
})
