const urlInput = document.getElementById('input-link')
const downloadBtn = document.getElementById('button-convert')
const log = document.getElementById('log')

downloadBtn.addEventListener('click', async () => {
  let url = urlInput.value.trim()

  urlInput.value = ""

  if (!url) {
    log.textContent += '\n[Erro] Link vazio'
    return
  }

  url = url.split('?')[0]

  log.textContent += `\n[Iniciando download] ${url}`
  try {
    const titulo = await window.api.extrairTitulo(url)
    log.textContent = titulo

    const resposta = await window.api.baixarAudio(url, 1)
    //log.textContent += `\n[Sucesso] ${resposta}`
  } catch (err) {
    //log.textContent += `\n[Erro] ${err}`
  }
})


function addBaixando() {

}

function addBaixados() {

}

function exBaixando() {
  
}