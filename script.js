document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');

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

    // 3. Add to Cart Functionality (Basic client-side)
    cartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.flower-card');
            const title = card.querySelector('h3').textContent;
            
            console.log(`Product Added to Cart: ${title}`);
            
            // User feedback
            event.target.textContent = 'Added!';
            event.target.classList.remove('bg-primary-green');
            event.target.classList.add('bg-accent-red');
            
            // Reset button after a short delay
            setTimeout(() => {
                event.target.textContent = 'Add to Cart';
                event.target.classList.remove('bg-accent-red');
                event.target.classList.add('bg-primary-green');
            }, 1500);
        });
    });
});