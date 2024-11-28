const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

class VideoEncryptor {
  constructor() {}

  encryptVideo(videoPath, encryptionKey, outputPath) {
    if (!fs.existsSync(videoPath)) {
      throw new Error(`Video file does not exist at ${videoPath}`);
    }

    const videoBytes = fs.readFileSync(videoPath);

    const cipher = crypto.createCipher("aes-256-cbc", encryptionKey);
    let encryptedBytes = Buffer.concat([
      cipher.update(videoBytes),
      cipher.final(),
    ]);

    outputPath = this.replaceExtension(outputPath, "encrypted");

    fs.writeFileSync(outputPath, encryptedBytes);

    return `Video encrypted and saved as ${outputPath}`;
  }

  decryptVideo(encryptedVideoPath, decryptionKey, outputPath) {
    if (!fs.existsSync(encryptedVideoPath)) {
      throw new Error(
        `Encrypted video file does not exist at ${encryptedVideoPath}`
      );
    }

    const encryptedBytes = fs.readFileSync(encryptedVideoPath);

    const decipher = crypto.createDecipher("aes-256-cbc", decryptionKey);
    let decryptedBytes = Buffer.concat([
      decipher.update(encryptedBytes),
      decipher.final(),
    ]);

    outputPath = this.replaceExtension(outputPath, "mp4");

    fs.writeFileSync(outputPath, decryptedBytes);

    return `Video decrypted and saved as ${outputPath}`;
  }

  replaceExtension(filePath, newExtension) {
    const { dir, name } = path.parse(filePath);
    return path.join(dir, `${name}.${newExtension}`);
  }
}

module.exports = VideoEncryptor;
