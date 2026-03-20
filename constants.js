import path from "path"

const GIT_DIR = ".git"
const OBJECTS_DIR = path.join(GIT_DIR, "objects")
const REFS_DIR = path.join(GIT_DIR, "refs")
const HEAD_FILE = path.join(GIT_DIR, "HEAD")

export { GIT_DIR, OBJECTS_DIR, REFS_DIR, HEAD_FILE };