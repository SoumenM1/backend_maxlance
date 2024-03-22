document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reset-password-form');
    const passwordInput = document.getElementById('password');
    const showPasswordCheckbox = document.getElementById('show-password');

    // Extract token and email from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    const email = urlParams.get('email');
     console.log(email,resetToken)
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
            const response = await fetch(`http://localhost:4000/reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, token:resetToken, newPassword })
            });
            console.log(response.json())
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
