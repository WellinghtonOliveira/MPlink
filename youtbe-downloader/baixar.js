const { execFile } = require('child_process')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const ytDlpPath = path.join(__dirname, 'bin', 'yt-dlp.exe')
const downloadsPath = path.join(__dirname, 'downloads')

// Cria pasta downloads se não existir
if (!fs.existsSync(downloadsPath)) {
  fs.mkdirSync(downloadsPath)
  console.log('Pasta "downloads" criada')
} else {
  console.log('Pasta "downloads" já existe')
}

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

    execFile(ytDlpPath, args, (error, stdout, stderr) => {
      // Sempre mostrar saída normal
      process.stdout.write(stdout)

      // Mostrar erros só se não for o erro que queremos ignorar
      if (stderr && !stderr.includes('expected string or bytes-like object')) {
        process.stderr.write(stderr)
      }

      if (error) {
        if (stderr.includes('expected string or bytes-like object')) {
          // Ignora esse erro específico e resolve normalmente
          resolve()
        } else {
          reject(error)
        }
      } else {
        resolve()
      }
    })
  })
}

async function lerLinks() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const links = []
  const pergunta = (query) => new Promise(resolve => rl.question(query, resolve))

  console.log('Coloque os links dos vídeos (pressione Enter em branco para finalizar):')

  let count = 1
  while (true) {
    const answer = await pergunta(`? Link #${count}: `)
    const link = answer.trim()
    if (!link) break

    const linkLimpo = link.split('?')[0]
    console.log(`Link limpo adicionado: ${linkLimpo}`)
    links.push(linkLimpo)
    count++
  }

  rl.close()
  return links
}

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
