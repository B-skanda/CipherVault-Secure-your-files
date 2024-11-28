# video-encryptor Documentation

Welcome to the documentation for **video-encryptor**, a powerful Node.js library for video encryption and decryption using AES encryption. This library simplifies the process of securing video content and can be used in a variety of applications, including content protection, secure video sharing, and more.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Getting Started](#getting-started)
   - [Importing the Library](#importing-the-library)
4. [Encrypting a Video](#encrypting-a-video)
   - [Usage](#usage)
5. [Decrypting an Encrypted Video](#decrypting-an-encrypted-video)
   - [Usage](#usage-1)
6. [File Extensions](#file-extensions)
7. [Error Handling](#error-handling)
8. [Dependencies](#dependencies)
9. [Contributing](#contributing)
10. [License](#license)
11. [Author](#author)
12. [Contact](#contact)

## Features

- **Encrypt Video Files:** Encrypt video files with a provided encryption key.
- **Decrypt Video Files:** Decrypt encrypted video files with the same encryption key.
- **File Extension Handling:** Automatically handle file extensions for output files.
- **Error Handling:** Built-in error handling for common scenarios.
- **Lightweight:** A lightweight and easy-to-use API.

## Installation

You can quickly integrate **video-encryptor** into your Node.js project using npm:

```bash
npm install video-encryptor
```

## Getting Started

### Importing the Library

To use **video-encryptor**, you need to import it into your Node.js project:

```javascript
const VideoEncryptor  = require("video-encryptor");
const videoEncryptor = new VideoEncryptor();
```

## Encrypting a Video

### Usage

To encrypt a video, you'll need the path to the video file, an encryption key, and the desired output file path. Here's how to use the library to encrypt a video:

```javascript
const videoPath = "./demo.mp4";
const encryptionKey = "your-secret-key";
const encryptedFilePath = "encrypted-video";
videoEncryptor.encryptVideo(videoPath, encryptionKey, encryptedFilePath);
```

## Decrypting an Encrypted Video

### Usage

To decrypt an encrypted video, you'll need the path to the encrypted video file, the encryption key used for encryption, and the desired output file path. Here's how to use the library to decrypt an encrypted video:

```javascript
const encryptedFilePath = "encrypted-video";
const encryptionKey = "your-secret-key";
const decryptedVideoPath = "decrypted-video";
videoEncryptor.decryptVideo(
  encryptedFilePath,
  encryptionKey,
  decryptedVideoPath
);
```

## File Extensions

- If the provided `outputPath` for encryption doesn't include an extension, it will default to `.encrypted`.
- If the provided `outputPath` for decryption doesn't include an extension, it will default to `.mp4`.

## Error Handling

The library includes robust error handling for various scenarios, such as invalid file paths, corrupted encrypted files, and existing output files. You can trust **video-encryptor** to handle unexpected situations gracefully.

## Dependencies

- [crypto-js](https://www.npmjs.com/package/crypto-js): A dependable library for AES encryption.

## Contributing

We welcome contributions from the community! Whether it's bug fixes, new features, or improvements to the documentation, your contributions are valuable. Please feel free to open issues or submit pull requests.

## License

**video-encryptor** is open-source software licensed under the ISC License. Feel free to use it in your projects.

## Author

Abhishek Chamoli ([GitHub](https://github.com/AbhishekChamoliDeveloper))

## Contact

For any questions, suggestions, or inquiries, you can reach out to me at abhishekchamoli007@gmail.com.

Thank you for using **video-encryptor**. We hope this library simplifies your video encryption needs and enhances the security of your video content.

Please replace `[GitHub]https://github.com/AbhishekChamoliDeveloper` with your actual GitHub profile URL and `abhishekchamoli007@gmail.com` with your contact email address. This comprehensive documentation provides detailed information on features, installation, usage, error handling, contributions, and licensing for your library.
