// Removed the wrapping function Login() {}
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
    const loginForm = document.getElementById('loginForm');
    
    // Get the message container element
    const messageContainer = document.getElementById('message-container');

    // Function to display an on-page message
    function displayMessage(message, type) {
        // Define Tailwind classes based on message type (success or error)
        const baseClasses = "p-4 rounded-lg font-semibold text-center transition-all duration-300 ease-in-out";
        let typeClasses = "";

        if (type === 'success') {
            typeClasses = "bg-primary-green text-white shadow-lg";
        } else if (type === 'error') {
            typeClasses = "bg-accent-red text-white shadow-lg";
        }
        
        messageContainer.innerHTML = `<div class="${baseClasses} ${typeClasses}">${message}</div>`;
        messageContainer.classList.remove('hidden');
    }

    // 1. Mobile Menu Toggle
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // 2. Hide mobile menu after a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // 3. Login Form Submission Handler (Client-side demo)
    loginForm.addEventListener('submit', (event) => {
        // Prevent the default form submission (page reload)
        event.preventDefault(); 
        
        // Clear any previous messages
        messageContainer.innerHTML = '';
        messageContainer.classList.add('hidden');

        const usernameInput = loginForm.querySelector('#username');
        const passwordInput = loginForm.querySelector('#password');

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // --- Validation Logic ---
        if (username === "" || password === "") {
            // ERROR LOGIC: Display error message
            displayMessage('Please enter both username and password.', 'error');
            // Re-enable inputs just in case they were disabled by a previous successful attempt
            loginForm.querySelectorAll('input, button').forEach(el => el.disabled = false); 
        } else {
            // --- SUCCESS LOGIC (Simulated) ---
            
            // 1. Display success message on the page
            displayMessage(`Login successful for ${username}! Redirecting...`, 'success');
            
            // 2. Disable the form fields and button to prevent double submission
            loginForm.querySelectorAll('input, button').forEach(el => el.disabled = true);
            
            // 3. Redirect after a short delay (e.g., 2 seconds) to allow user to read the message
            setTimeout(() => {
                // The redirection to homepage.html
                window.location.href = "homepage.html"; 
            }, 2000); // 2000 milliseconds = 2 seconds
        }
    });
});
// End of file