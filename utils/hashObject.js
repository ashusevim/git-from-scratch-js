import crypto from "crypto"
import fs from "fs"
import saveObjectUtils from "./saveobject.js"

function hashObject(filePath){
    // 1. Read the file content
    const content = fs.readFileSync(filePath)

    // 2. Create a Header: "blob <size>\0"
    const header = `blob ${content.length}\0`
    const store = Buffer.concat([
        Buffer.from(header),
        content
    ])

    // 3. Generate SHA-1 Hash
    const hash = crypto.createHash('sha1').update(store).digest('hex')

    // 4. Save the object to the database and return the hash
    saveObjectUtils.saveObject(hash, store)
    return hash
}

export default { hashObject }