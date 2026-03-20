import fs from "fs"
import path from "path"
import zlib from "zlib"

function catFile(sha){
    // 1. convert the SHA to the path
    const folder = sha.substring(0, 2)
    const fileName = sha.substring(2)

    const objectPath = path.join('.git', 'objects', folder, fileName)

    if(!fs.existsSync(objectPath)){
        console.log("Object not found!")
        return
    }

    // 2. read the compressed data from the disk
    const compressedData = fs.readFileSync(objectPath)

    // 3. decompress (inflate) it using zlib
    const decompressedVersion = zlib.inflateSync(compressedData)

    // 4. git objects have a header followed by a null byte \0
    // we find the index of the first null byte to separate header from content
    const nullByteIndex = decompressedVersion.indexOf(0);
    const header = decompressedVersion.slice(0, nullByteIndex).toString()
    const content = decompressedVersion.slice(nullByteIndex+1)

    console.log(`object header: ${header}`)
    console.log(content.toString())
}

export default { catFile }