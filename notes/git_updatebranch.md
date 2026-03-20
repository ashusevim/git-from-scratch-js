# Advanced Git commands

- why git update-branch even exists?

1. it basically (points to)reference to the commit
2. you can update refs using commands like git checkout, git branch, or git reset 


## How git stores references internally?

- .git/refs/heads (for branches)
- .git/refs/tags (for tags)

#### Each file contains a commit hash

`` .git/refs/heads/main `` contains 'abc1234'