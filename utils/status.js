import fs from "fs"
import path from "path"
import zlib from "zlib"
import { getObjectPath } from "./git-log.js"
import calculateHashUtils from "./calculatehash.js"

function gitStatus(){
    // get the last commit's tree
    const refPath = path.join('.git', 'refs', 'heads', 'main')
    
    // if the reference does not exists, that means there is no files to be tracked
    if(!fs.existsSync(refPath)){
        console.log("No commits yet. All files are untracked")
        return
    }

    // removing extra space from left and right
    const lastCommitSha = fs.readFileSync(refPath, 'utf-8').trim()
    const objectPath = fs.readFileSync(getObjectPath(lastCommitSha))
    const commitData = zlib.inflateSync(objectPath).toString()
    const treeSha = commitData.match(/^tree ([a-z0-9]{40})/m)[1]

    // load the tree in map for easy lookups
    const treeEntries = parseTree(treeSha)

    // scan the working directory
    const filesOnDir = fs.readFileSync('.').filter(f => f !== '.git' && f !== 'index.js' && fs.statSync(f).isFile());

    console.log("On branch main")

    filesOnDir.forEach(file => {
        const currentContent = fs.readFileSync(file)
        const currentHash = calculateHashUtils.calculateHash(currentContent)

        // \x1b[31m] it tells the terminal to change the text color

        // ANSI Escape codes
        // \031[31mHello\031[0m -> Red text -> standard for untracked/deleted files
        // \033[33mHello\033[0m -> Yellow Text - > standard for files that are modified
        
        // 0m resets the color back to the normal

        if(!treeEntries.has(file)){
            console.log(`  Untracked:  \x1b[31m${file}\x1b[0m`)
        }
        else if (treeEntries.get(file) !== currentHash) {
            console.log(`  Modified:   \x1b[33m${file}\x1b[0m`)
        }   
    });
}

function parseTree(sha){
    const treeMap = new Map()
    const treeBuffer = zlib.inflateSync(fs.readFileSync(getObjectPath(sha)))
    let content = treeBuffer.slice(treeBuffer.indexof(0)+1)

    while(content.length > 0){
        const spaceIndex = content.indexOf(32)
        const nullIndex = content.indexOf(0)
        const filename = content.slice(spaceIndex+1, nullIndex).toString()
        const shaIndex = content.slice(nullIndex+1, nullIndex+21).toString('hex')
    
        treeMap.set(filename, shaIndex)
        content = content.slice(nullIndex + 21)
    }

    return treeMap
}

export default { gitStatus }