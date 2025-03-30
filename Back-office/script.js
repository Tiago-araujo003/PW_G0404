// Function to fetch accounts from the accounts.txt file
async function fetchAccounts() {
    try {
        const response = await fetch('accounts.txt');
        if (!response.ok) {
            throw new Error('Failed to fetch accounts.');
        }
        const data = await response.text();
        const accounts = data.split('\n').filter(line => line.trim()).map(line => {
            const [username, password] = line.split(',');
            return { username: username.trim(), password: password.trim() };
        });
        return accounts;
    } catch (error) {
        console.error(error);
        alert('An error occurred while fetching accounts.');
        return [];
    }
}

// Handle form submission for the login page
async function handleLogin(event) {
    event.preventDefault(); // Prevent page reload
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        const accounts = await fetchAccounts();
        const account = accounts.find(acc => acc.username === username && acc.password === password);

        if (account) {
            alert(`Logged in as ${username}`);
            window.location.href = "Dashboard.html"; // Redirect to the dashboard
        } else {
            alert('Invalid username or password.');
        }
    } else {
        alert('Please fill in both fields.');
    }
}

// Handle form submission for the new account page
async function handleCreateAccount(event) {
    event.preventDefault(); // Prevent page reload
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value; // Email is not used in this example
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (username && email && password && confirmPassword) {
        if (password === confirmPassword) {
            try {
                const response = await fetch('http://localhost:3000/create-account', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    alert(`Account created for ${username}`);
                } else {
                    const errorMessage = await response.text();
                    alert(`Failed to create account: ${errorMessage}`);
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred while creating the account.');
            }
        } else {
            alert('Passwords do not match.');
        }
    } else {
        alert('Please fill in all fields.');
    }
}

// Handle form submission for the reset password page
function handleResetPassword(event) {
    event.preventDefault(); // Prevent page reload
    const email = document.getElementById('email').value;

    if (email) {
        alert(`Password reset link sent to ${email}`);
    } else {
        alert('Please enter your email.');
    }
}

// Handle Google login
window.handleGoogleLogin = async function(response) {
    const token = response.credential; // Extract the Google token

    try {
        const res = await fetch('http://localhost:3000/google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });

        if (res.ok) {
            const data = await res.json();
            alert(`Logged in as ${data.name}`);
            window.location.href = "Dashboard.html"; // Redirect to the dashboard
        } else {
            const errorMessage = await res.text();
            alert(`Google login failed: ${errorMessage}`);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred during Google login.');
    }
};
