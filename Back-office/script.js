// Handle form submission for the login page
function handleLogin(event) {
    event.preventDefault(); // Prevent page reload
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        // Simulate successful login
        alert(`Logged in as ${username}`);
        window.location.href = "Dashboard.html"; // Redirect to the dashboard
    } else {
        alert('Please fill in both fields.');
    }
}

// Handle form submission for the new account page
function handleCreateAccount(event) {
    event.preventDefault(); // Prevent page reload
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (username && email && password && confirmPassword) {
        if (password === confirmPassword) {
            alert(`Account created for ${username}`);
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
