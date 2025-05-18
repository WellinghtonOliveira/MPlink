const { execFile } = require('child_process')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

// Caminho do yt-dlp.exe e pasta downloads
const ytDlpPath = path.join(__dirname, 'bin', 'yt-dlp.exe')
const downloadsPath = path.join(__dirname, 'downloads')

// Cria pasta downloads se não existir
if (!fs.existsSync(downloadsPath)) {
  fs.mkdirSync(downloadsPath)
  console.log('Pasta "downloads" criada')
} else {
  console.log('Pasta "downloads" já existe')
}

// Função para baixar áudio de um link
function baixarAudio(url, index) {
  return new Promise((resolve, reject) => {
    const outputTemplate = `downloads\\${index}-%(title)s.%(ext)s`

    const args = [
      url.trim(),
      '--extract-audio',
      '--audio-format', 'mp3',
      '--ffmpeg-location', path.join(__dirname, 'bin'),
      '--restrict-filenames',
      '-o', outputTemplate
    ]

    console.log(`Executando comando yt-dlp para o link #${index}...`)

    execFile(ytDlpPath, args, (error, stdout, stderr) => {
      console.log('------ Output yt-dlp ------')
      console.log(stdout)
      console.log('------ Erros yt-dlp ------')
      console.log(stderr)

      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

// Função para ler links do terminal
async function lerLinks() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const links = []

  function pergunta(query) {
    return new Promise(resolve => rl.question(query, resolve))
  }

  console.log('Coloque os links dos vídeos (pressione Enter em branco para finalizar):')

  let count = 1
  while (true) {
    const answer = await pergunta(`? Link #${count}: `)
    const link = answer.trim()

    if (!link) break

    // Limpa possíveis parâmetros depois do "?"
    const linkLimpo = link.split('?')[0]
    console.log(`Link limpo adicionado: ${linkLimpo}`)
    links.push(linkLimpo)
    count++
  }

  rl.close()
  return links
}

// Função principal
async function main() {
  try {
    const links = await lerLinks()
    console.log(`Links coletados: ${links.length}`)

    for (let i = 0; i < links.length; i++) {
      try {
        console.log(`[${i + 1}] Iniciando download do link: ${links[i]}`)
        await baixarAudio(links[i], i + 1)
        console.log(`Download do vídeo #${i + 1} concluído.`)
      } catch (err) {
        console.error(`Erro no download do vídeo #${i + 1}:`, err)
      }
    }

    console.log('Todos os downloads foram concluídos!')
  } catch (err) {
    console.error('Erro geral:', err)
  }
}

main()
