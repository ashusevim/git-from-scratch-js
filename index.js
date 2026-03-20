import fs from "fs"
import path from "path"
import { log } from "./utils/git-log.js"
import commitUtils from "./utils/commit.js"
import catFileUtils from "./utils/catFile.js"
import process from "process"
import checkoutUtils from "./utils/checkout.js"
import statusUtils from "./utils/status.js"
import { handleInit } from "./utils/init.js"
import { add } from "./utils/add.js"
import { push } from "./utils/push.js"

// const filePath = process.argv[1]
const operation = process.argv[2]

switch(operation){
    case "init": 
        handleInit()
        break;
    case "commit":
        const msg = process.argv[3] || "no message"
        commitUtils.handleCommit(msg);
        break;``
    case "log":
        log()
        break;
    case "cat-file":
        const sha = process.argv[3]
        if(sha){
            catFileUtils.catFile(sha)
        }
        else{
            console.log("Please provide a SHA hash.")
        }
        break;

    case "checkout":
        const targetSha = process.argv[3]
        if(targetSha){
            checkoutUtils.handleCheckout(targetSha)
        }
        else{
            console.log("Please provide a target SHA.")
        }
        break;
    
    case "status":
        statusUtils.gitStatus();
        break;

    case "add":
        const addArgs = process.argv.slice(3)
        if(addArgs.length > 0){
            add(addArgs)
        }
        else{
            console.log("Nothing specified. nothing added")
        }
        break

    // for future use
    case "push":
        const args = process.argv.slice(3)
        push(args)
        break;

    default:
        console.log("unknown command")
        break;
}