document.addEventListener('DOMContentLoaded', () => {
    const encryptForm = document.getElementById('encrypt-form');
    const decryptForm = document.getElementById('decrypt-form');
    const statusDiv = document.getElementById('status');

    // Tab switching functionality
    window.switchTab = (tab) => {
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));
        
        document.querySelector(`.tab[onclick="switchTab('${tab}')"]`).classList.add('active');
        document.getElementById(`${tab}-content`).classList.add('active');
    };

    // Encrypt file
    encryptForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('file-input');
        const encryptionKey = document.getElementById('encryption-key').value;
        
        if (!fileInput.files.length) {
            showStatus('Please select a file to encrypt', 'error');
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('key', encryptionKey);

        try {
            // Disable submit button and show loading state
            const submitButton = encryptForm.querySelector('button');
            submitButton.disabled = true;
            submitButton.textContent = 'Encrypting...';

            const response = await fetch('/encrypt', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                showStatus(`✅ File encrypted successfully: ${result.filename}`, 'success');
                // Clear file input and key
                fileInput.value = '';
                document.getElementById('encryption-key').value = '';
            } else {
                showStatus(`❌ Encryption failed: ${result.message}`, 'error');
            }
        } catch (error) {
            showStatus('❌ Error during encryption', 'error');
            console.error('Encryption error:', error);
        } finally {
            // Re-enable submit button
            const submitButton = encryptForm.querySelector('button');
            submitButton.disabled = false;
            submitButton.textContent = 'Encrypt File';
        }
    });

    // Decrypt file
    decryptForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('encrypted-file');
        const decryptionKey = document.getElementById('decryption-key').value;
        
        if (!fileInput.files.length) {
            showStatus('Please select an encrypted file', 'error');
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('key', decryptionKey);

        try {
            // Disable submit button and show loading state
            const submitButton = decryptForm.querySelector('button');
            submitButton.disabled = true;
            submitButton.textContent = 'Decrypting...';

            const response = await fetch('/decrypt', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                showStatus(`✅ File decrypted successfully: ${result.filename}`, 'success');
                // Clear file input and key
                fileInput.value = '';
                document.getElementById('decryption-key').value = '';
            } else {
                showStatus(`❌ Decryption failed: ${result.message}`, 'error');
            }
        } catch (error) {
            showStatus('❌ Error during decryption', 'error');
            console.error('Decryption error:', error);
        } finally {
            // Re-enable submit button
            const submitButton = decryptForm.querySelector('button');
            submitButton.disabled = false;
            submitButton.textContent = 'Decrypt File';
        }
    });

    // Status message display function
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status-message ${type} show`;
        
        // Clear status after 10 seconds
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.classList.remove('show');
        }, 10000);
    }
    
    // Logout functionality (stub - implement actual logout logic)
   // Logout function
window.logout = () => {
    // Clear any session-related data if stored (optional)
    sessionStorage.clear(); // Clear session storage if used
    localStorage.clear();   // Clear local storage if used

    // Redirect to login.html
    window.location.href = 'login.html';
};

});