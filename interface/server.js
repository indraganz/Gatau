// server.js
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint untuk registrasi
app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        // Cek jika username atau email sudah ada
        db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, row) => {
            if (row) {
                return res.status(400).json({ message: 'Username or email already exists', success: false });
            }
        });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan pengguna baru ke dalam database
        db.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email], function(err) {
            if (err) {
                return res.status(500).json({ message: 'Error creating user', success: false });
            }
            res.status(201).json({ message: 'User registered successfully', success: true });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', success: false });
    }
});

// Endpoint untuk login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password', success: false });
        }

        // Cek password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password', success: false });
        }

        res.json({ message: 'Login successful', success: true });
    });
});

// Jalankan server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
