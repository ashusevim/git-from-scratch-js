import fs from "fs";
import path from "path";
import crypto from "crypto";
import hashObjectUtils from "./hashObject.js";
import saveObjectUtils from "./saveobject.js";

// A list of files/directories to ignore when creating the tree
const IGNORE = ['.git', 'node_modules', 'index.js', 'constants.js', 'README.md', 'notes'];

function writeTree(dir = '.') {
    // 1. Get all files and directories in the current path
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    const treeEntries = [];

    for (const entry of entries) {
        const entryName = entry.name;
        // 2. Skip any ignored files/directories
        if (IGNORE.includes(entryName) || !entry.isFile()) {
            continue;
        }

        // 3. For each file, create a blob object and get its hash
        const fileHash = hashObjectUtils.hashObject(path.join(dir, entryName));
        
        // 4. Get file permissions (mode)
        const fileStat = fs.statSync(path.join(dir, entryName));
        // Git uses '100644' for normal files and '100755' for executable files.
        const mode = fileStat.mode & 0o100 ? '100755' : '100644';

        // push all the names and entries to the treeEntries, for better lookups
        treeEntries.push({ mode, name: entryName, hash: fileHash });
    }

    // 5. Sort entries alphabetically, as Git does. This is crucial for hash consistency.
    treeEntries.sort((a, b) => a.name.localeCompare(b.name));

    // 6. Construct the tree object content
    const treeContent = Buffer.concat(
        treeEntries.map(entry => {
            // The format is: <mode> <name>\0<20-byte_binary_hash>
            const hashBuffer = Buffer.from(entry.hash, 'hex');
            return Buffer.concat([
                Buffer.from(`${entry.mode} ${entry.name}\0`),
                hashBuffer
            ]);
        })
    );

    // 7. Create, hash, and save the complete tree object
    const header = `tree ${treeContent.length}\0`;
    const store = Buffer.concat([Buffer.from(header), treeContent]);
    const treeHash = crypto.createHash('sha1').update(store).digest('hex');
    saveObjectUtils.saveObject(treeHash, store);

    return treeHash;
}

export default { writeTree };