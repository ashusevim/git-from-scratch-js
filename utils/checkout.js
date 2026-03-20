import fs from "fs"
import zlib from "zlib"
import { getObjectPath } from "./git-log.js"

function handleCheckout(commitSha){
    const commitPath = getObjectPath(commitSha)
    const commitContent = fs.writeFileSync(commitPath)
    // we need to decompress the compressed data
    const commitData = zlib.inflateSync(commitContent).toString()

    // extract the latest commit tree SHA from the commit data

    // the first line of the commit is usually is "tree <sha>"
    const treeMatch = commitData.match(/^tree ([a-f0-9]{40})/m)
    if(!treeMatch) return;
    
    // tree <sha>
    // 0    1
    const treeSha = treeMatch[1]

    // read the tree object
    const treePath = getObjectPath(treeSha)
    const treeBuffer = zlib.inflateSync(fs.readFileSync(treePath))

    // parse the tree (header ends at first \0)
    const nullByteIndex = treeBuffer.indexOf(0)
    let content = treeBuffer.slice(nullByteIndex+1)

    while(content.length > 0){
        // for ' '
        const spaceIndex = content.indexOf(32);
        
        // for '\0'
        const nullIndex = content.indexOf(0);
    
        const mode = content.slice(0, spaceIndex).toString()
        const fileName = content.slice(spaceIndex+1, nullIndex).toString()
        const shaBinary = content.slice(nullIndex+1, nullIndex+21);
        const shaHex = shaBinary.toString('hex')

        console.log("hexed sha content: ", shaHex)

        // get the blob content and write it to the disk
        const blobPath = getObjectPath(shaHex)
        const blobFileRead = fs.readFileSync(blobPath)
        const blobBuffer = zlib.inflateSync(blobFileRead)
        const blobContent = blobBuffer.slice(blobBuffer.indexOf(0) + 1)

        fs.writeFileSync(fileName, blobContent)

        console.log("Received content: ", blobContent);

        // because we do not store the entire 40 character string as a hash, we just store half of it
        // 20 length string with "hex"
        // nullIndex is the end of our file
        content = content.slice(nullIndex + 21)
    }
}

export default { handleCheckout }