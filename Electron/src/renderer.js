const urlInput = document.getElementById('input-link')
const downloadBtn = document.getElementById('button-convert')
const log = document.getElementById('log')

downloadBtn.addEventListener('click', async () => {
  let url = urlInput.value.trim()
  if (!url) {
    log.textContent += '\n[Erro] Link vazio'
    return
  }

  // 🔧 Limpar parâmetros indesejados
  url = url.split('?')[0]

  log.textContent += `\n[Iniciando download] ${url}`
  try {
    const resposta = await window.ytDownloader.baixarAudio(url, 1)
    log.textContent += `\n[Sucesso] ${resposta}`
  } catch (err) {
    log.textContent += `\n[Erro] ${err}`
  }
})
