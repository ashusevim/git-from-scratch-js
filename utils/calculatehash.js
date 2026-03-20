import crypto from "crypto"
import Buffer from "buffer"

function calculateHash(currentContent){
    // Create a Header: "blob <size>\0"
    const header = Buffer.from(`blob ${currentContent.length}\0`);
    const store = Buffer.concat([header, currentContent]);
    
    // Generate SHA-1 Hash
    return crypto.createHash('sha1').update(store).digest('hex');
}

export default { calculateHash };