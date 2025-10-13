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
let fila = [] // fila de links para baixar
let baixandoAgora = false

downloadBtn.addEventListener('click', () => {
  const entrada = urlInput.value.trim()
  urlInput.value = "" 

  if (!entrada) {
    log.textContent += '\n[Erro] Link vazio'
    return
  }

  // Aceita múltiplos links separados por espaço ou quebra de linha
  const novosLinks = entrada.split(/\s+|\n+/).map(link => link.split('?')[0]).filter(Boolean)

  // Adiciona na fila e mostra na lista de baixando
  novosLinks.forEach(link => {
    fila.push(link)
    addBaixando(link) // já mostra o link imediatamente
  })

  // Se não está baixando, começa
  if (!baixandoAgora) {
    processarFila()
  }
})

async function processarFila() {
  if (fila.length === 0) {
    stopBaixando()
    return
  }

  baixandoAgora = true
  loadBaixando()

  const link = fila.shift()

  try {
    const titulo = await window.api.extrairTitulo(link)

    // Atualiza o link na lista "Baixando" para o título real
    atualizarBaixando(link, titulo)

    await window.api.baixarAudio(link, 1)

    exBaixando(titulo)
    addBaixados(titulo)
  } catch (err) {
    log.textContent += `\n[Erro] ${err}`
    exBaixando(link)
  }

  processarFila()
}

function addBaixando(texto) {
  const novoElementoMusica = document.createElement("li")
  novoElementoMusica.textContent = texto
  listaBaixando.appendChild(novoElementoMusica)
}

function atualizarBaixando(antigo, novo) {
  const itens = listaBaixando.querySelectorAll("li")
  itens.forEach(el => {
    if (el.textContent === antigo) {
      el.textContent = novo
    }
  })
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
    if (el.textContent === titulo) {
      listaBaixando.removeChild(el)
    }
  })

  if (listaBaixando.children.length === 0) {
    stopBaixando()
    baixandoAgora = false
  }
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
