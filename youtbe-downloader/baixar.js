const inquirer = require('inquirer')
const fs = require('fs')
const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const { type } = require('os')
const { rejects } = require('assert')

if (!fs.existsSync('downloads')) {
    fs.mkdirSync('downloads')
}

async function perguntarLinks() {// Perguntando quantos links são
    const links = []

    console.log('Coloque aqui quais videos mp3 deseja baixar (precione enter apos acabar)')

    while(true) {
        const { link } = await inquirer.prompt([
            {
                type: 'input',
                name: 'link',
                message: `Link #${links.length + 1}:`
            }
        ])

        if (!link.trim()) break
        if (!ytdl.validateURL(link)) {
            console.clear()
            console.log('Link invalido, tente novamente.')
            continue
        }

        links.push(link)
    }

    return links
}

async function baixarAudio(link, index) {
    try {
        const info = await ytdl.getInfo(link)
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '')
        const filePath = path.join(__dirname, 'downloads', `${index + 1} - ${title}.mp3`)

        console.clear()
        console.log(`Baixando: ${title}`)

        await new Promise((resolve, reject) => {

        })
    }
}