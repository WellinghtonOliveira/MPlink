const urlInput = document.getElementById('input-link')
const quantiaBaixados = document.getElementById("quantia-baixados")
const downloadBtn = document.getElementById('button-convert')
const listaBaixando = document.getElementById("lista-baixando")
const listaBaixados = document.getElementById("lista-baixados")
const log = document.getElementById('log')
const carregandoBaixando = document.getElementById("carregamento-baixando")
const carregandoBaixados = document.getElementById("carregamento-baixados")
const arrayPontos = ['', '.', '..', '...']

let loadingInterval = null
let pontosIndex = 0

downloadBtn.addEventListener('click', async () => {
  let separador = urlInput.value.trim()

  urlInput.value = ""

  if (!separador) {
    log.textContent += '\n[Erro] Link vazio'
    return
  }

  let i = 0
  let url = []
  url.push(separador.split('?')[0])
  addBaixando(url[i])
  exBaixando(" --- ")

  loadBaixando()

  for (i = 0; i < url.length; i++) {
    try {
      const titulo = await window.api.extrairTitulo(url[i])
      addBaixando(titulo)

      await window.api.baixarAudio(url[i], 1)
      exBaixando(titulo)
      addBaixados(titulo)
      stopBaixando()
    } catch (err) {
      log.textContent = `\n[Erro] ${err}`
      stopBaixando()
    }
  }
})

function addBaixando(titulo) {
  const novoElementoMusica = document.createElement("li")
  novoElementoMusica.textContent = titulo
  listaBaixando.appendChild(novoElementoMusica)
}

function addBaixados(titulo) {
  const ex = document.getElementById("ex")
  const novoElementoMusica = document.createElement("li")
  novoElementoMusica.textContent = titulo

  if (ex) ex.remove()

  listaBaixados.appendChild(novoElementoMusica)
  quantiaBaixados.textContent = listaBaixados.children.length
}

function exBaixando(titulo) {
  let nomeFilhoLi = listaBaixando.querySelectorAll("li")

  nomeFilhoLi.forEach((el) => {
    if (el.textContent == titulo) {
      listaBaixando.removeChild(el)
    }
  })
}

function loadBaixando() {
  if (loadingInterval) return

  pontosIndex = 0

  loadingInterval = setInterval(() => {
    carregandoBaixando.textContent = `Baixando${arrayPontos[pontosIndex]}`
    pontosIndex = (pontosIndex + 1) % arrayPontos.length
  }, 500)
}

function stopBaixando() {
  clearInterval(loadingInterval)
  loadingInterval = null
  carregandoBaixando.textContent = 'Baixando'
}



// TODO compilar o arquivo mais tarde