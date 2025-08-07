const urlInput = document.getElementById('input-link')
const downloadBtn = document.getElementById('button-convert')
const log = document.getElementById('log')
const listaBainxando = document.getElementById("lista-baixando")
const listaBaixados = document.getElementById("lista-baixados")
let i = 0   

downloadBtn.addEventListener('click', async () => {
  let url = urlInput.value.trim()

  urlInput.value = ""
  
  if (!url) {
    addBaixando(i)
    i++
    //log.textContent += '\n[Erro] Link vazio'
    return
  }

  exBaixando(toString(urlInput))

  url = url.split('?')[0]

  //log.textContent += `\n[Iniciando download] ${url}`
  try {
    const titulo = await window.api.extrairTitulo(url)
    log.textContent = titulo

    const resposta = await window.api.baixarAudio(url, 1)
    //log.textContent += `\n[Sucesso] ${resposta}`
  } catch (err) {
    //log.textContent += `\n[Erro] ${err}`
  }
})

function addBaixando(titulo) {
  const novoElementoMusica = document.createElement("li")
  novoElementoMusica.textContent = titulo
  listaBainxando.appendChild(novoElementoMusica)
}

function addBaixados() {

}

function exBaixando(titulo) {
  let nomeFilhoLi = listaBainxando.querySelectorAll("li")

  nomeFilhoLi.forEach((el) => {
    if (el.textContent == titulo) {
      listaBainxando.removeChild(el)
    }
  })
}