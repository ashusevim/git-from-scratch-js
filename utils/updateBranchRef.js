import path from "path"
import fs from "fs"

// .git/heads/<branch_name>
// e.g., .git/refs/heads/main or .git/refs/heads/master
// default branch = main
function updateBranchRef(commitHash, branchName = "main"){
    const referencePath = path.join('.git', 'refs', 'heads', branchName)

    // we needs to make sure that the directory exists (e.g., .git/refs/heads/)
    const referenceDirectory = path.dirname(referencePath)

    if(!fs.existsSync(referenceDirectory)){
        // make new one if not exists already
        fs.mkdirSync(referenceDirectory, 
            {
                recursive: true
            }
        )
    }

    // write the 40-character SHA-1 has to the file
    fs.writeFileSync(referencePath, `${commitHash}`)

    console.log(`Updated branch ${branchName} to ${commitHash}`)
}

export default { updateBranchRef }