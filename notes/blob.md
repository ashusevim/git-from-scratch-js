# Blob (Binary large object)

- It contains only the content of the file
- git doesn't care about the filename yet, it only cares about the bytes inside it
- they can be read as a text or binary data, and converted into ReadableStream so that its methods can be used
- blobs can be used when to represent the data that is important in javascript file format

1. to create a blog: you needs to define a header like 'blob <content-length>\0' (\0 is a null byte)
2. hashes it: it uses SHA-1 to create a 40-char hex string
3. compresses it: it uses zlib (deflate)
4. stores it: saves the compressed data in .git/objects/