import fs from "fs"
import path from "path"
import commitTreeUtils from "./commit-tree.js";
import updateBranchRefUtils from "./updateBranchRef.js";
import writeTreeUtils from "./writeTree.js";

function handleCommit(commitMessage){
    // 1. snapshot the current directory into a tree
    const treeHash = writeTreeUtils.writeTree('.')

    // 2. find the "parent" (the current commit in main, if it exists)
    const referencePath = path.join('.git', 'refs', 'heads', 'main');

    let parentHash = ""

    if(fs.existsSync(referencePath)){
        parentHash = fs.readFileSync(referencePath, 'utf-8').trim();
    }

    // 3. create a commit object
    const commitHash = commitTreeUtils.commitTree(treeHash, commitMessage, parentHash)

    // update the branch to point to this new commit
    updateBranchRefUtils.updateBranchRef(commitHash, 'main')

    console.log(`[main ${commitHash.substring(0, 7)}] ${commitMessage}`)
}

export default { handleCommit }