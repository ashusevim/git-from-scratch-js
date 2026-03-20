import zlib from "zlib"

function compress(data){
    // compress the hashed data
    zlib.gzip(data, (error, compressed) => {
        if(error){
            console.log('Compression error:', error);
            return;
        }

        zlib.gunzip(compressed, (error, decompressed) => {
            if(error){
                console.log('Decompression error: ', error)
                return;
            }

            console.log("Decompressed data: ", decompressed)
        })
    })
}

export default { compress }