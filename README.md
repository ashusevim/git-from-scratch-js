# git-from-scratch-js

A Git implementation built from scratch in Node.js. Zero dependencies — only Node.js built-in modules (`crypto`, `fs`, `zlib`, `path`).

Implements the core Git object model (blobs, trees, commits) with SHA-1 content-addressable storage and zlib compression.

## Installation

```sh
git clone <repo-url>
cd git-from-scratch-js
```

No `npm install` required.

**Requires:** Node.js v16+

## Usage

```sh
node index.js <command> [args]
```

### Quick Start

```sh
node index.js init
node index.js add .
node index.js commit "first commit"
node index.js log
node index.js status
```

### Commands

| Command | Description |
|---|---|
| `init` | Initialize a new repository (creates `.git/` directory structure) |
| `add <file...>` | Stage files for the next commit. Use `.` or `--all` to stage everything |
| `commit <message>` | Create a commit from staged changes |
| `log` | Walk the commit history on `main` and print each commit |
| `cat-file <sha>` | Decompress and print a Git object's header and content |
| `checkout <sha>` | Restore the working directory to the state of a given commit |
| `status` | Show untracked (red) and modified (yellow) files |
| `push` | Stub — prints a confirmation message, no remote interaction |

## How It Works

### Object Storage

Git stores everything as objects keyed by their SHA-1 hash. This implementation follows the same model:

1. **Content is prefixed with a header** — `blob <size>\0<content>`, `tree <size>\0<entries>`, or `commit <size>\0<metadata>`
2. **SHA-1 hash of the header + content** becomes the object's ID
3. **Objects are zlib-compressed** and written to `.git/objects/<first 2 chars>/<remaining chars>` (fan-out strategy)

```
Object = SHA1("blob 11\0Hello World")
Stored at .git/objects/5e/1c309dae684989e4868223b0c29d685756f04
```

### Object Types

**Blob** — Stores raw file content.

```
blob <content-length>\0<file-content>
```

**Tree** — Stores a snapshot of a directory. Each entry references a blob or subtree.

```
tree <size>\0<mode> <filename>\0<20-byte-hash><mode> <filename>\0<20-byte-hash>...
```

Entries are sorted alphabetically. Mode is `100644` for regular files, `100755` for executables.

**Commit** — Points to a tree and optionally a parent commit.

```
commit <size>\0
tree <tree-sha>
parent <parent-sha>
author <name> <email> <timestamp> <timezone>
committer <name> <email> <timestamp> <timezone>

<message>
```

### Index (Staging Area)

The staging area is stored at `.git/index` as a JSON object mapping file paths to their blob SHA-1 hashes. This differs from real Git's binary index format.

```json
{
  "file.txt": "5e1c309dae684989e4868223b0c29d685756f04",
  "src/app.js": "a1b2c3d4e5f6..."
}
```

### Branch References

Branches are stored as files under `.git/refs/heads/`. The file contains the SHA-1 of the latest commit on that branch. `HEAD` points to `refs/heads/main`.

## Project Structure

```
index.js              CLI entry point — parses command, dispatches to handler
constants.js          Shared path constants (GIT_DIR, OBJECTS_DIR, REFS_DIR, HEAD_FILE)
utils/
  init.js             Creates .git/, .git/objects/, .git/refs/heads/, .git/HEAD
  add.js              Stages files: hashes content as blobs, updates .git/index
  commit.js           Orchestrates commit: writeTree → create commit object → update ref
  commit-tree.js      Builds commit object with tree, parent, author, timestamp, message
  writeTree.js        Recursively creates tree objects from directory contents
  hashObject.js       Creates blob objects (prefix header, SHA-1, save)
  saveobject.js       Writes zlib-compressed objects to .git/objects/ (fan-out)
  calculatehash.js    Pure SHA-1 hash for content comparison
  updateBranchRef.js  Writes commit SHA to .git/refs/heads/<branch>
  git-log.js          Follows parent chain from refs/heads/main, prints each commit
  catFile.js          Reads and decompresses an object, splits header from content
  checkout.js         Reads commit → tree → blobs, writes files to working directory
  status.js           Compares working directory files against last commit's tree
  push.js             Stub — no real remote support
notes/                Technical notes on Git internals
```

## Limitations

- **Single branch** — Only `main`. No branch creation, switching, or merging.
- **No `.gitignore`** — Ignores are hardcoded in `writeTree.js` and `add.js` (`.git`, `node_modules`, `index.js`, `constants.js`, `README.md`, `notes/`).
- **No remote support** — `push` is a stub.
- **JSON index** — Uses a JSON file for the staging area instead of Git's binary format.
- **Hardcoded author** — Commit author is fixed in `commit-tree.js`.
- **Checkout bug** — `checkout.js:7` uses `fs.writeFileSync` instead of `fs.readFileSync`, which will fail to read the commit object.

## License

ISC
