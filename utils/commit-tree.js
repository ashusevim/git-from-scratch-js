import crypto from "crypto"
import saveObjectUtils from "./saveobject.js"

function commitTree(treeHash, message, parentHash){
    const authorName = "Ashish Prajapati"
    const authorEmail = "ashishprajapati5220@gmail.com"
    const timeStamp = Math.floor(Date.now() / 1000)
    const timeZone = "+0000"

    // 1. build the commit body
    let content = `tree ${treeHash}\n`
    if(parentHash){
        content += `parent ${parentHash}\n`
    }

    content += `author ${authorName} <${authorEmail}> ${timeStamp} ${timeZone}\n`
    content += `committer ${authorName} <${authorEmail}> ${timeStamp} ${timeZone}\n`
    content += `\n${message}\n`

    // add header: "commit <size>\0"
    const header = `commit ${Buffer.byteLength(content)}\0`
    const store = Buffer.concat([
        Buffer.from(header),
        Buffer.from(content)
    ])

    const commitHash = crypto.createHash('sha1').update(store).digest('hex')
    saveObjectUtils.saveObject(commitHash, store) // Save both the hash and the content

    console.log("hashed commit: ", commitHash);
    return commitHash
}

export default { commitTree }