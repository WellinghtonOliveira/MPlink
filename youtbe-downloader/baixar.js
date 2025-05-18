const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const { execFile } = require('child_process')

const ytDlpPath = path.join(__dirname, 'bin', 'yt-dlp.exe')

// Cria a pasta "downloads" se não existir
if (!fs.existsSync('downloads')) {
    fs.mkdirSync('downloads')
}

async function perguntarLinks() {
    const links = []
    console.log('Coloque os links dos vídeos (pressione Enter em branco para finalizar):')

    while (true) {
        const { link } = await inquirer.prompt([
            {
                type: 'input',
                name: 'link',
                message: `Link #${links.length + 1}:`
            }
        ])

        if (!link.trim()) break

        if (!link.includes('youtube.com') && !link.includes('youtu.be')) {
            console.clear()
            console.log('Link inválido, tente novamente.')
            continue
        }

        const linkLimpo = link.split('?')[0]
        links.push(linkLimpo)
    }

    return links
}

async function baixarAudio(link, index) {
    return new Promise((resolve, reject) => {
        const outputTemplate = `${index + 1} - %(title)s.%(ext)s`
        const outputDir = path.join(__dirname, 'downloads')

        console.log(`Iniciando download: ${link}`)

        execFile(ytDlpPath, [
            link,
            '--extract-audio',
            '--audio-format', 'mp3',
            '--ffmpeg-location', path.join(__dirname, 'bin'),
            '-o', path.join(outputDir, outputTemplate) // 👈🏽 caminho correto aqui
        ], (error, stdout, stderr) => {
            if (error) {
                console.log(`Erro ao baixar ${link}: ${stderr || error.message}`)
                return reject(error)
            }
            console.log(`Finalizado: ${link}`)
            resolve()
        })
    })
}

async function main() {
    const links = await perguntarLinks()

    if (links.length === 0) {
        console.clear()
        console.log('Nenhum link foi fornecido')
        return
    }

    for (let i = 0; i < links.length; i++) {
        await baixarAudio(links[i], i)
    }

    console.log('Todos os downloads foram concluídos!')
}

main()
