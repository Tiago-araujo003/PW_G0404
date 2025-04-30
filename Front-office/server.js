const express = require('express');
const fs = require('fs');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = 3000;
const accountsFilePath = path.join(__dirname, 'Back-office/accounts.txt');
const CLIENT_ID = '989743293355-q7t8qv7pm7b1j8hfi4gcpdkbk3fcp53e.apps.googleusercontent.com'; // Replace with your Google Client ID
const client = new OAuth2Client(CLIENT_ID);

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to create a new account
app.post('/create-account', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    // Append the new account to the accounts.txt file
    const newAccount = `${username},${password}\n`;
    fs.appendFile(accountsFilePath, newAccount, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to create account.');
        }
        res.status(200).send('Account created successfully.');
    });
});

// Endpoint to handle Google login
app.post('/google-login', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        // Check if the user already exists in accounts.txt
        const accounts = fs.readFileSync(accountsFilePath, 'utf-8');
        const accountExists = accounts.split('\n').some(line => line.startsWith(email));

        if (!accountExists) {
            // Create a new account if it doesn't exist
            const newAccount = `${email},google-auth\n`;
            fs.appendFileSync(accountsFilePath, newAccount);
        }

        res.status(200).send({ message: 'Login successful', email, name });
    } catch (error) {
        console.error(error);
        res.status(401).send('Invalid Google token');
    }
});

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'Back-office')));

// Serve the accounts.txt file explicitly
app.get('/accounts.txt', (req, res) => {
    res.sendFile(accountsFilePath);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
