//-----------------Home Page--------------------
// Load cart from localStorage or initialize empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartModal = document.querySelector('.cart-modal');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartCount = document.querySelector('.cart-count');
const cartBtn = document.querySelector('.cart-btn');
const closeBtn = document.querySelector('.close-btn');

// Quantity controls for product cards
document.querySelectorAll('.product-card').forEach(card => {
    const decreaseBtn = card.querySelector('.decrease');
    const increaseBtn = card.querySelector('.increase');
    const quantityInput = card.querySelector('.quantity-input');

    decreaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    });

    quantityInput.addEventListener('change', () => {
        if (quantityInput.value < 1) {
            quantityInput.value = 1;
        }
    });
});

// Open cart modal
cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'flex';
    updateCart();
});

// Close cart modal
closeBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close modal when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Add to cart
document.querySelectorAll('.product-card .add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productName = e.target.dataset.name;
        const productPrice = parseFloat(e.target.dataset.price);
        const quantity = parseInt(e.target.parentElement.querySelector('.quantity-input').value);
        cart.push({ name: productName, price: productPrice, quantity: quantity });
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        alert(`${productName} تمت إضافته إلى السلة!`);
    });
});

// Update cart display
function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let totalItems = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        totalItems += item.quantity;
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <p>${item.name}</p>
            <div class="quantity-controls">
                <button class="decrease" data-index="${index}">-</button>
                <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-index="${index}">
                <button class="increase" data-index="${index}">+</button>
            </div>
            <p>${item.price * item.quantity} ريال</p>
            <div class="action-buttons">
                <button class="delete-btn" data-index="${index}">حذف</button>
                <button class="buy-now-btn" data-index="${index}">شراء منفرد</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    // Add event listeners for cart quantity controls
    document.querySelectorAll('.cart-item .decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            }
        });
    });

    document.querySelectorAll('.cart-item .increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            cart[index].quantity++;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        });
    });

    document.querySelectorAll('.cart-item .quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = e.target.dataset.index;
            let value = parseInt(e.target.value);
            if (value < 1) {
                value = 1;
                e.target.value = 1;
            }
            cart[index].quantity = value;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        });
    });

    // Add event listeners for delete and buy now buttons
    document.querySelectorAll('.cart-item .delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        });
    });

    document.querySelectorAll('.cart-item .buy-now-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            const item = cart[index];
            alert(`تم شراء ${item.name} بكمية ${item.quantity} بقيمة ${item.price * item.quantity} ريال بنجاح!`);
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
            cartModal.style.display = 'none';
        });
    });

    cartTotal.textContent = `الإجمالي: ${total} ريال`;
    cartCount.textContent = totalItems;
}

// Initial cart update
updateCart();
//---------------Checkout Page------------------
