// Store the cart items state, initialized from local storage
let cart = JSON.parse(localStorage.getItem('dflowershop_cart')) || []; 

// Get DOM elements
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total');
const cartItemsContainer = document.getElementById('cart-items');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartOverlay = document.getElementById('cart-overlay');
const cartButton = document.getElementById('cart-button');
const closeCartButtons = document.querySelectorAll('#close-cart-button, #close-cart-button-bottom');
const dashboardButton = document.getElementById('dashboard-button');
const dashboardModal = document.getElementById('dashboard-modal');
const closeDashboardButton = document.getElementById('close-dashboard-button');
const body = document.body;
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

// NEW: Get the 'Proceed to Checkout' button for the purchase logic
const checkoutButton = document.querySelector('.w-full.py-3.bg-accent-red'); 


function formatCurrency(amount) {
    // Format to Philippine Peso (PHP)
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
}

// Helper function to save the cart state to localStorage
function saveCart() {
    localStorage.setItem('dflowershop_cart', JSON.stringify(cart));
}

// --- Cart Display Functions ---

function attachRemoveListeners() {
    // Re-attach listeners every time the cart UI is updated
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemId = parseInt(event.currentTarget.getAttribute('data-remove-id'));
            removeItem(itemId);
        });
    });
}

function removeItem(itemId) {
    // Find index of item
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        // Decrease quantity, or remove if quantity is 1
        if (cart[itemIndex].qty <= 1) {
             cart = cart.filter(item => item.id !== itemId);
        } else {
            cart[itemIndex].qty -= 1; 
        }
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    let total = 0;
    let count = 0;
    
    // Clear existing items but keep the 'empty message' element
    cartItemsContainer.querySelectorAll('.cart-item').forEach(item => item.remove());
    
    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
    } else {
        emptyCartMessage.classList.add('hidden');
    }

    // Iterate through cart items and build the HTML
    [...cart].reverse().forEach(item => { 
        total += item.price * item.qty;
        count += item.qty;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item', 'flex', 'items-center', 'space-x-4', 'border-b', 'pb-4', 'mb-4');
        itemElement.setAttribute('data-item-id', item.id);
        
        // Use the image path from the data attribute
        const itemImage = item.img; 

        itemElement.innerHTML = `
            <img src="${itemImage}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg" onerror="this.onerror=null; this.src='https://placehold.co/80x80/E96677/FAF5F5?text=Flower';">
            <div class="flex-grow">
                <p class="font-medium">${item.name}</p>
                <p class="text-sm text-gray-500">Qty: ${item.qty}</p>
                <p class="font-bold text-accent-red">${formatCurrency(item.price)}</p>
            </div>
            <button class="remove-item-btn text-gray-400 hover:text-accent-red" aria-label="Remove item" data-remove-id="${item.id}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        `;
        // Added an onerror to the image tag in the cart just in case the provided image path is still incorrect
        cartItemsContainer.appendChild(itemElement); 
    });

    cartCountElement.textContent = count;
    cartTotalElement.textContent = formatCurrency(total);
    
    attachRemoveListeners();
    saveCart(); 
}

// --- Cart Toggling Logic (Revised) ---

function toggleCart() {
    const isCartOpen = cartOverlay.classList.contains('open');

    // If dashboard is open, close it before opening/closing the cart
    if (dashboardModal.classList.contains('open')) {
        toggleDashboard(); 
    }

    cartOverlay.classList.toggle('open');
    // Lock scrolling if EITHER modal is open
    body.classList.toggle('overflow-hidden', !isCartOpen || dashboardModal.classList.contains('open'));
}

cartButton.addEventListener('click', toggleCart);
closeCartButtons.forEach(button => button.addEventListener('click', toggleCart));

// --- Dashboard Toggling Logic (Revised) ---

function toggleDashboard() {
    const isDashboardOpen = dashboardModal.classList.contains('open');
    
    // If cart is open, close it before opening/closing the dashboard
    if (cartOverlay.classList.contains('open')) {
        toggleCart(); 
    }

    if (!isDashboardOpen) {
        // Prepare to open: remove 'hidden' immediately so the transition can run
        dashboardModal.classList.remove('hidden'); 
        // Add 'open' class after a brief moment to ensure the transition fires
        setTimeout(() => {
            dashboardModal.classList.add('open');
        }, 10);
    } else {
        // Prepare to close: remove 'open' to start the closing transition
        dashboardModal.classList.remove('open');
        // Add 'hidden' after the transition completes (0.3s defined in CSS)
        setTimeout(() => {
            dashboardModal.classList.add('hidden');
        }, 300); // 300ms matches the CSS transition duration
    }

    // Lock scrolling if EITHER modal is open
    body.classList.toggle('overflow-hidden', !isDashboardOpen || cartOverlay.classList.contains('open'));
}

dashboardButton.addEventListener('click', toggleDashboard);
closeDashboardButton.addEventListener('click', toggleDashboard);

dashboardModal.addEventListener('click', (event) => {
    // Close modal when clicking on the dimmed background
    if (event.target === dashboardModal) {
        toggleDashboard();
    }
});

// --- Mobile Menu Toggling Logic ---

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// --- "Add to Cart" Functionality ---
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const card = event.currentTarget.closest('.flower-card');
        
        // Retrieve data from the data attributes
        const productId = parseInt(card.dataset.productId);
        const productName = card.dataset.productName;
        const productPrice = parseInt(card.dataset.productPrice);
        const productImg = card.dataset.productImg;
        
        let existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                img: productImg, 
                qty: 1
            });
        }
        
        updateCartDisplay();

        // Optional: Show visual feedback
        button.textContent = 'Added!';
        setTimeout(() => {
            button.textContent = 'Add to Cart';
        }, 1000);

        // Optional: Automatically open the cart after adding an item
        if (!cartOverlay.classList.contains('open')) {
            toggleCart();
        }
    });
});


// ------------------------------------------------------------------
// --- NEW PURCHASE/CHECKOUT FUNCTIONALITY ---
// ------------------------------------------------------------------

function simulatePurchase() {
    // 1. Check if the cart is empty before proceeding
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before checking out.");
        return;
    }

    // 2. Simulate the purchase process (e.g., sending data to a server)
    console.log("Processing purchase for items:", cart);
    
    // 3. Clear the cart and update display
    cart = [];
    updateCartDisplay(); // This clears the cart in the UI and local storage (via saveCart)

    // 4. Show success message (error message requested by user, but used for success)
    alert("Successfully Purchased! Your order has been successfully placed at DFlowershop. Thank you for your purchase!");

    // 5. Close the cart overlay
    toggleCart(); 
}

// Attach the purchase function to the checkout button
checkoutButton.addEventListener('click', simulatePurchase);

// ------------------------------------------------------------------
// --- Initialization ---
// ------------------------------------------------------------------

// This is called once on page load to check localStorage and populate the cart UI
updateCartDisplay();