const express = require('express');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { encryptVideo, decryptVideo } = require('./videoEncryptor');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Encrypt endpoint
app.post('/encrypt', upload.single('videoFile'), async (req, res) => {
    const videoPath = req.file.path;
    const encryptionKey = req.body.encryptionKey;
    const outputPath = req.body.outputPath || `${videoPath}.encrypted`;

    try {
        await encryptVideo(videoPath, encryptionKey, outputPath);
        res.json({ message: 'Encryption successful', status: 'success' });
    } catch (error) {
        res.json({ message: 'Encryption failed: ' + error.message, status: 'error' });
    } finally {
        fs.unlink(videoPath, () => {});
    }
});

// Decrypt endpoint
app.post('/decrypt', upload.single('encryptedFile'), async (req, res) => {
    const encryptedPath = req.file.path;
    const decryptionKey = req.body.decryptionKey;
    const outputPath = req.body.outputPath || `${encryptedPath}.decrypted`;

    try {
        await decryptVideo(encryptedPath, decryptionKey, outputPath);
        res.json({ message: 'Decryption successful', status: 'success' });
    } catch (error) {
        res.json({ message: 'Decryption failed: ' + error.message, status: 'error' });
    } finally {
        fs.unlink(encryptedPath, () => {});
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
