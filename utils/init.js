import fs from "fs";
import path from "path";
import process from "process";
import { GIT_DIR, OBJECTS_DIR, REFS_DIR, HEAD_FILE } from "../constants.js";

/*
    1. checks if the .git folder already exists or not
        a. if yes, we can just return the message and return
    2. create a directories
        a. .git
        b. objects
        c. refs/heads/<branch_name>
    3. initialize the head file with default branch as "main"
*/
function handleInit(){

    // use the process.cwd() to get the directory you are currently working
    const CWD = process.cwd();

    // return if the .git folder already exists
    if(fs.existsSync(GIT_DIR)){
        console.log(`Reinitialized existing Git repository in ${path.join(CWD, GIT_DIR, path.sep)}`);
        return;
    }

    // create .git dir
    fs.mkdirSync(GIT_DIR)

    // create objects dir
    fs.mkdirSync(OBJECTS_DIR)
    
    // create dir for multiple branches recursively
    fs.mkdirSync(path.join(REFS_DIR, "heads"), { recursive: true });

    /*  for now we do not have any content in the head file
        we need to initialize the head file, 
        and tell the Git that we are currently on the 'main' branch by default
    */
    fs.writeFileSync(HEAD_FILE, 'ref: refs/heads/main\n')

    // show the success message to the user
    console.log(`Initialized empty Git repository in ${path.join(CWD, GIT_DIR, path.sep)}`)
}

export { handleInit }