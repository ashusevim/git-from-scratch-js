import fs from "fs"
import path from "path"
import zlib from "zlib"
import commit from "./commit.js"

/*
    1.Read .git/HEAD to see which branch we are currently on (refs/HEADS/main)
    2.go to that file (.git/refs/heads/main) to get the latest commit SHA
    3.go to .git/objects and find that commit line
    4.decompress it using zlib 
*/

function getObjectPath(sha){
    return path.join('.git', 'objects', sha.substring(0, 2), sha.substring(2))
}

function log(){
    // 1. get the latest commit SHA from the main branch
    const refPath = path.join('.git', 'refs', 'heads', 'main')

    if(!fs.existsSync(refPath)){
        console.log("No commits yet!")
        return
    }

    let currentSha = fs.readFileSync(refPath, 'utf-8').trim()

    // 2. walk back wards through the "parent" pointers
    while(currentSha){
        const objectPath = getObjectPath(currentSha)
        const compressedData = fs.readFileSync(objectPath)
        const decompressed = zlib.inflateSync(compressedData).toString()

        // 3. parse the commit object text
        console.log("---")
        console.log(`commit: ${currentSha}`)

        // extract the message
        const parts = decompressed.split('\n\n')
        const header = parts[0]
        const message = parts[1]
        console.log(`message: ${message.trim()}`)

        // 4. find the parent SHA in the header to keep the loop going
        const parentMatch = header.match(/^parent ([a-f0-9]{40})/m);
        currentSha = parentMatch ? parentMatch[1] : null;
    }
}

export { getObjectPath, log }