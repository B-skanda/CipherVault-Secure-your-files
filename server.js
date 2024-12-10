const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views"));

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Ensure directories exist
const ENCRYPTED_FOLDER = path.join(__dirname, 'encrypted');
const DECRYPTED_FOLDER = path.join(__dirname, 'decrypted');
[ENCRYPTED_FOLDER, DECRYPTED_FOLDER].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
});

// AES Encryption configuration
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // AES block size

// Derive key from password using PBKDF2
function deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, ENCRYPTION_KEY_LENGTH, 'sha256');
}

// Encryption endpoint
app.post('/encrypt', upload.single('file'), (req, res) => {
    try {
        const file = req.file;
        const key = req.body.key;

        if (!file || !key) {
            return res.status(400).json({ success: false, message: 'File and key are required' });
        }

        // Generate salt and initialization vector
        const salt = crypto.randomBytes(16);
        const iv = crypto.randomBytes(IV_LENGTH);

        // Derive encryption key
        const derivedKey = deriveKey(key, salt);

        // Create cipher
        const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, derivedKey, iv);

        // Read file and encrypt
        const inputFile = fs.readFileSync(file.path);
        const encryptedData = Buffer.concat([
            salt,   // Prepend salt
            iv,     // Prepend IV
            cipher.update(inputFile),
            cipher.final()
        ]);

        // Generate unique filename
        const encryptedFileName = `encrypted_${Date.now()}${path.extname(file.originalname)}.encrypted`;
        const encryptedFilePath = path.join(ENCRYPTED_FOLDER, encryptedFileName);

        // Write encrypted file
        fs.writeFileSync(encryptedFilePath, encryptedData);

        // Clean up temporary upload
        fs.unlinkSync(file.path);

        res.json({ 
            success: true, 
            message: 'File encrypted successfully', 
            filename: encryptedFileName 
        });

    } catch (error) {
        console.error('Encryption error:', error);
        res.status(500).json({ success: false, message: 'Encryption failed' });
    }
});

// Decryption endpoint
app.post('/decrypt', upload.single('file'), (req, res) => {
    try {
        const file = req.file;
        const key = req.body.key;

        if (!file || !key) {
            return res.status(400).json({ success: false, message: 'File and key are required' });
        }

        // Read encrypted file
        const encryptedData = fs.readFileSync(file.path);

        // Extract salt and IV
        const salt = encryptedData.slice(0, 16);
        const iv = encryptedData.slice(16, 32);
        const encryptedContent = encryptedData.slice(32);

        // Derive decryption key
        const derivedKey = deriveKey(key, salt);

        // Create decipher
        const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, derivedKey, iv);

        // Decrypt file
        const decryptedData = Buffer.concat([
            decipher.update(encryptedContent),
            decipher.final()
        ]);

        // Generate unique filename (remove .encrypted extension)
        const originalFileName = `decrypted_${Date.now()}${path.extname(file.originalname.replace('.encrypted', ''))}`;
        const decryptedFilePath = path.join(DECRYPTED_FOLDER, originalFileName);

        // Write decrypted file
        fs.writeFileSync(decryptedFilePath, decryptedData);

        // Clean up temporary upload
        fs.unlinkSync(file.path);

        res.json({ 
            success: true, 
            message: 'File decrypted successfully', 
            filename: originalFileName 
        });

    } catch (error) {
        console.error('Decryption error:', error);
        res.status(500).json({ success: false, message: 'Decryption failed' });
    }
});

// Serve static files
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use(express.static(__dirname));

// Additional server setup
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port http://localhost:${PORT}`);
// });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});


// Serve login.html by default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Additional server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

// // Debug file path
// console.log('Login HTML Path:', path.join(__dirname, 'views', 'login.html'));

// // Serve login.html by default
// app.get('/', (req, res) => {
//     const loginPath = path.join(__dirname, 'views', 'login.html');
    
//     // Check if file exists before sending
//     if (fs.existsSync(loginPath)) {
//         res.sendFile(loginPath);
//     } else {
//         console.error('Login HTML file not found:', loginPath);
//         res.status(404).send('Login page not found');
//     }
// });

module.exports = app;
