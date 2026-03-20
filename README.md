# Build your own GIT

- I am trying to replicate the Git like version control system implementation in nodejs

### git init

1. checks if the .git folder already exists or not
    a. if yes, we can just return the message and return
2. create a directories
    a. .git
    b. objects
    c. refs/heads/<branch_name>
3. initialize the head file with default branch as "main"

```javascript
function handleInit(){
    if(fs.existsSync(GIT_DIR)){
        console.log(`Reinitialized existing Git repository in ${path}/.git/`);
        return;
    }

    fs.mkdirSync(GIT_DIR)
    fs.mkdirSync(OBJECTS_DIR)
    fs.mkdirSync(filePath.join(REFS_DIR, "heads"), 
        { recursive: true }
    );

    fs.writeFileSync(HEAD_FILE, 'ref: refs/heads/main\n')

    console.log(`Initialized empty Git repository in ${filePath.resolve(GIT_DIR)}`)
}
```