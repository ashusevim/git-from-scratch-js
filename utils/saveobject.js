import fs from "fs"
import path from "path"
import zlib from "zlib"

function saveObject(hash, storeBuffer){
    // 1. Get the directory and file from the hashed string (fan-out strategy)
    const dir = hash.substring(0, 2)
    const file = hash.substring(2)

    const directoryPath = path.join('.git', 'objects', dir)

    // 2. Create the directory if it does not exist
    if(!fs.existsSync(directoryPath)){
        fs.mkdirSync(directoryPath, { recursive: true })
    }

    // 3. Compress the data
    const compressed = zlib.deflateSync(storeBuffer);

    // 4. Write the compressed data to the file
    fs.writeFileSync(path.join(directoryPath, file), compressed)
}

export default { saveObject }