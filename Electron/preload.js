const { contextBridge, ipcRenderer } = require('electron')

// Expõe apenas o que você precisa para o front
contextBridge.exposeInMainWorld('api', {
  extrairTitulo: (url) => ipcRenderer.invoke('extrair-titulo', url),
  baixarAudio: (url, qualidade) => ipcRenderer.invoke('baixar-audio', { url, qualidade })
})
