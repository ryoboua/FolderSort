const fs = require('fs')
const path = require('path')

function createFolder(name) {
    return new Promise(function(resolve, reject) {
        return fs.mkdir(path.join(__dirname, name), {}, err => {
            if (err) {
                if(err.code === "EEXIST") {
                    console.log(`Folder ${name} already exists`)
                    resolve(name)
                } else {
                    reject(`Failed to create folder named  ${name}`)
                }
            } else {
                resolve(name)
            }
        } )
    })
}

function readFiles() {
    return new Promise(function(resolve, reject) {
        return fs.readdir(__dirname, (err, files) => {
            if (err) {
                reject(err)
            } else {
                resolve(files)
            }
        })
    })
}

function moveFile(fileName, newPath) {
    return new Promise(function(resolve, reject) {
        return fs.rename(path.join(__dirname, fileName), path.join(newPath, fileName), err => {
           if(err) {
            reject(`Failed to move ${fileName}`)
           } else {
            resolve(console.log(`File ${fileName} succesfully moved`)) 
           }
        })
    })
}
function reducer(acc, currentValue) { 
        let ext = path.extname(currentValue)
        if(ext !== '' && ext !== '.js' && !acc.includes(ext)) {
            return acc.concat(ext)
        } else {
            return acc
        }
}

async function runFolderSort() {
    try {
        const files = await readFiles()

        if (files && files.length) {
            const fileExtensionsInFolder = files.reduce(reducer, [])

            if(fileExtensionsInFolder.length) {
                
                for( let ext of fileExtensionsInFolder) {
                    ext = ext.split('.')[1]
                    await createFolder(ext)
                }
    
                for (let file of files) {
                    let ext = path.extname(file)
                    if(fileExtensionsInFolder.includes(ext)) {
                        await moveFile(file, `${__dirname}/${ext.split('.')[1]}/`)
                    }
                }
            } else {
                console.log('There are no files to sort')
            }
        } 
    } catch(error) {
        console.log(error)
    }
}

runFolderSort()