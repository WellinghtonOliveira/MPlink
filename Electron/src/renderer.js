const urlInput = document.getElementById('input-link')
const quantiaBaixados = document.getElementById("quantia-baixados")
const downloadBtn = document.getElementById('button-convert')
const listaBaixando = document.getElementById("lista-baixando")
const listaBaixados = document.getElementById("lista-baixados")
const log = document.getElementById('log')
const carregandoBaixando = document.getElementById("carregamento-baixando")
const arrayPontos = ['', '.', '..', '...']

let loadingInterval = null
let pontosIndex = 0
let fila = []
let baixandoAgora = false

downloadBtn.addEventListener('click', () => {
  const entrada = urlInput.value.trim()
  urlInput.value = ""

  if (!entrada) {
    log.textContent += '\n[Erro] Link vazio'
    return
  }

  const novosLinks = entrada.split(/\s+|\n+/)
    .map(link => link.split('?')[0])
    .filter(Boolean)

  novosLinks.forEach(link => {
    fila.push(link)
    addBaixando(link)
  })

  // inicia o processamento se não estiver baixando
  if (!baixandoAgora) processarFila()
})

async function processarFila() {
  if (baixandoAgora) return
  baixandoAgora = true
  loadBaixando()

  while (fila.length > 0) {
    const link = fila.shift()
    try {
      const titulo = await window.api.extrairTitulo(link)
      atualizarBaixando(link, titulo)
      await window.api.baixarAudio(link, 1)
      exBaixando(titulo)
      addBaixados(titulo)
    } catch (err) {
      log.textContent += `\n[Erro ao baixar ${link}]: ${err}`
      exBaixando(link)
    }
  }

  stopBaixando()
  baixandoAgora = false
}

function addBaixando(texto) {
  const novo = document.createElement("li")
  novo.textContent = texto
  listaBaixando.appendChild(novo)
}

function atualizarBaixando(antigo, novo) {
  listaBaixando.querySelectorAll("li").forEach(el => {
    if (el.textContent === antigo) el.textContent = novo
  })
}

function addBaixados(titulo) {
  const ex = document.getElementById("ex")
  const novo = document.createElement("li")
  novo.textContent = titulo
  if (ex) ex.remove()
  listaBaixados.appendChild(novo)
  quantiaBaixados.textContent = listaBaixados.children.length
}

function exBaixando(titulo) {
  listaBaixando.querySelectorAll("li").forEach(el => {
    if (el.textContent === titulo) listaBaixando.removeChild(el)
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
