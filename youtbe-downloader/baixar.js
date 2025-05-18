//Esta biblioteca é usada para criar um interface interativa no cmd
const inquirer = require('inquirer')

//Esta ja e uma biblioteca padra do node, usada para fazer manipulação de arquivos no sistema
const fs = require('fs')

//Biblioteca padrão do node, usada para lidar com os caminhos de arquivos e diretórios de forma correta
const path = require('path')

//Função do node que permite executar comandos e programas externos
const { execFile } = require('child_process')

const ytDlpPath = path.join(__dirname, 'bin', 'yt-dlp.exe')

//Se caso nao houver uma pasta downloads o fs criara uma
if (!fs.existsSync('downloads')) {
    fs.mkdirSync('downloads')
}

//Função assíncrona que fica pedindo links até aperta o ender em branco
async function perguntarLinks() {
    const links = []

    console.log('Coloque os links dos vídeos (pressione Enter em branco para finalizar):')

    while (true) {
        const { link } = await inquirer.prompt([ // Pergunta o link da vez
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

        // Remove parâmetros extras (ex: ?si=...)
        const linkLimpo = link.split('?')[0]

        links.push(linkLimpo)
    }

    return links
}

//Recebe um link e um índice para numerar o arquivo salvo
async function baixarAudio(link, index) {
    return new Promise((resolve, reject) => {
        const outputPath = path.join(__dirname, 'downloads', `${index + 1} - %(title)s.%(ext)s`)

        console.log(`Iniciando download: ${link}`)

        execFile(ytDlpPath, [ //usado para executar o yt-dlp.exe com os argumentos corretos
            link,
            '--extract-audio',// pega o audio do video
            '--audio-format', 'mp3', // converte em mp3
            '--ffmpeg-location', path.join(__dirname, 'bin'),// indica onde esta a pasta
            '-o', outputPath // diz onde salvar o arquivo
        ], (error, stdout, stderr) => {

            if (error) {
                console.log(`Erro ao baixar ${link}: ${stderr}`)
                return reject(error)
            }
            console.log(`Finalizado: ${link}`)
            resolve()
        })
    })
}

// função principal que chama as outras
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
