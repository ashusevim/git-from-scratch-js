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

# Build Your Own Git (Node.js)

> This project is a simplified, educational re-implementation of core Git features in Node.js. It demonstrates how version control works under the hood by building a minimal Git-like system from scratch.

---

## Features
- Initialize a new repository (`init`)
- Add files to the index (`add`)
- Commit changes (`commit`)
- View commit logs (`log`)
- Inspect objects by SHA (`cat-file`)
- Checkout previous commits (`checkout`)
- Show working directory status (`status`)
- Simulate pushing to remote (`push`)

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)

### Installation
1. Clone this repository:
    ```sh
    git clone <repo-url>
    cd git-from-scratch-js
    ```
2. Install dependencies (if any):
    ```sh
    npm install
    ```

---

## Usage

All commands are run via Node.js:
```sh
node index.js <command> [args]
```

### Commands

#### 1. `init`
Initializes a new repository in the current directory.
- Creates a `.git` folder with `objects` and `refs/heads/main`.
- Sets up `HEAD` to point to `main`.

#### 2. `add <file1> <file2> ...`
Adds files to the staging area (index).
- Supports adding multiple files.
- Handles `.` or `--all` to add all files (except `.git` and script files).

#### 3. `commit [message]`
Creates a new commit from staged changes.
- Snapshots the current directory into a tree object.
- Stores commit metadata and updates the branch reference.

#### 4. `log`
Shows the commit history for the current branch.
- Walks back through parent commits, displaying SHA and messages.

#### 5. `cat-file <sha>`
Displays the content and header of a Git object by SHA.
- Decompresses and prints the object from `.git/objects`.

#### 6. `checkout <commit-sha>`
Checks out a specific commit.
- Updates the working directory to match the tree of the given commit.

#### 7. `status`
Shows the status of files in the working directory.
- Compares working directory, index, and last commit.
- Highlights untracked, modified, and staged files.

#### 8. `push`
Simulates pushing the current branch to a remote.
- Prints a confirmation message (no real remote interaction).

---

## Project Structure

- `index.js` — Main CLI entry point, command dispatcher
- `constants.js` — Shared constants (paths, filenames)
- `utils/` — Core logic for each command:
  - `init.js`, `add.js`, `commit.js`, `git-log.js`, `catFile.js`, `checkout.js`, `status.js`, `push.js`, etc.
- `notes/` — Technical notes and explanations

---

## Example Workflow
```sh
node index.js init
node index.js add file.txt
node index.js commit "Initial commit"
node index.js log
node index.js status
```

## License
ISC
