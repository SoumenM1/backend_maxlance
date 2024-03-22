document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reset-password-form');
    const passwordInput = document.getElementById('password');
    const showPasswordCheckbox = document.getElementById('show-password');

    // Extract token and email from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    const email = urlParams.get('email');

    // Function to toggle password visibility
    showPasswordCheckbox.addEventListener('change', function() {
        passwordInput.type = this.checked ? 'text' : 'password';
    });

    // Function to handle form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const newPassword = passwordInput.value;

        // Call your API to update the password
        try {
            const response = await fetch(`https://backend-maxlance.onrender.com/reset/${resetToken}?email=${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: newPassword })
            });
            if (response.data) {
                // Password reset successful, redirect to login page
                window.location.href = 'https://soumenmernapp.netlify.app/login';
                return;
            } else {
                // Password reset failed, handle error
                console.error('Password reset failed:', response.statusText);
                return;
            }
        } catch (error) {
            console.error('Error resetting password:', error);
        }
    });
});
