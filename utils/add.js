import fs from "fs";
import path from "path";
import process from "process";
import hashObjectUtils from "./hashObject.js"

// we can take array of files to be added in the tracked list
function add(paths){
    const indexPath = path.join('.git', 'index')
    let index = {}

    // 1. Load existing index file if already exists
    if(fs.existsSync(indexPath)){
        index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'))
    }

    // 2. files to be added
    let filesToAdd = []

    if(paths.includes('.') || paths.includes('--all')){
        // find all the files, we can ignore .git and our script files
        filesToAdd = getAllFiles('.')
    }
    else{
        filesToAdd = paths
    }

    filesToAdd.forEach(filePath => {
        // if the file on the given path is not available
        // if the filePath is of some directory
        if(fs.existsSync(filePath) || fs.statSync(filePath).isDirectory())return

        // hash the file and save the blob
        const content = fs.readFileSync(filePath)

        // this saves the blob to .git/objects
        const blobHash = hashObjectUtils.hashObject(content)

        // update the index entry
        index[filePath] = blobHash;

        console.log(`Staged: ${filePath}`);
    });

    // save the index
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2))
}

function getAllFiles(directoryPath, arrayOfFiles = []){
    const files = fs.readdirSync(directoryPath)

    files.forEach(file => {
        if(file === '.git' || file === 'node_modules' || file === 'index.js' || file === 'constants.js') return;
        
        const fullPath = path.join(directoryPath, file);
        if(fs.statSync(fullPath).isDirectory()){
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles)
        }
        else{
            arrayOfFiles.push(fullPath.replace(/\\/g, '/'))
        }
    })

    return arrayOfFiles
}

export { add }