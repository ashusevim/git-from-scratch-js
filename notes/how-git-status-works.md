- git calculates the changes on the go

- git performs two major comparisons between two different places:
    1. The Index (The Staging Area)
        - The most important file for tracking current changes is .git/index.
        - This is a binary file (not a folder).
        - It acts as a "virtual snapshot" of what you intend to commit next.
        - It contains a list of every file path in your project and the SHA-1 hash of that file as it existed when you last ran git add