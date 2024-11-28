const fs = require('fs');
const crypto = require('crypto');

function encryptVideo(videoPath, encryptionKey, outputPath) {
    return new Promise((resolve, reject) => {
        const iv = crypto.randomBytes(16);  // Generate a 16-byte IV
        const key = crypto.createHash('sha256').update(encryptionKey).digest().slice(0, 32);  // Ensure 256-bit key

        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        const input = fs.createReadStream(videoPath);
        const output = fs.createWriteStream(outputPath);

        output.write(iv); // Write the IV to the output file

        input.pipe(cipher).pipe(output);

        output.on('finish', () => resolve(`Encryption successful: ${outputPath}`));
        output.on('error', (err) => reject(`Encryption failed: ${err.message}`));
    });
}

function decryptVideo(encryptedPath, decryptionKey, outputPath) {
    return new Promise((resolve, reject) => {
        fs.open(encryptedPath, 'r', (err, fd) => {
            if (err) return reject(`Failed to open file: ${err.message}`);

            const iv = Buffer.alloc(16);
            fs.read(fd, iv, 0, 16, 0, (err, bytesRead) => {
                if (err) return reject(`Failed to read IV: ${err.message}`);
                if (bytesRead !== 16) return reject(`Expected 16 bytes for IV, got ${bytesRead}`);

                const key = crypto.createHash('sha256').update(decryptionKey).digest().slice(0, 32);
                const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
                const input = fs.createReadStream(encryptedPath, { start: 16 });
                const output = fs.createWriteStream(outputPath);

                input.pipe(decipher).pipe(output);

                output.on('finish', () => resolve(`Decryption successful: ${outputPath}`));
                output.on('error', (err) => reject(`Decryption failed: ${err.message}`));
            });
        });
    });
}

module.exports = {
    encryptVideo,
    decryptVideo
};
