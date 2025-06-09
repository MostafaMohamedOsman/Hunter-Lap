// Sample products data
const products = [
    {
        id: 1,
        name: "سماعات لاسلكية",
        price: 199,
        description: "سماعات لاسلكية بجودة صوت عالية، بطارية تدوم حتى 20 ساعة، وتصميم مريح.",
        image: "https://via.placeholder.com/600x400"
    },
    {
        id: 2,
        name: "هاتف ذكي",
        price: 2999,
        description: "هاتف ذكي بمعالج قوي، كاميرا بدقة 48 ميجابكسل، وشاشة AMOLED.",
        image: "https://via.placeholder.com/600x400"
    },
    {
        id: 2,
        name: "ساعة ذكية",
        price: 799,
        description: "ساعة ذكية تدعم تتبع اللياقة، إشعارات الهاتف، وتصميم أنيق.",
        image: "https://via.placeholder.com/600x400"
    },
    {
        id: 4,
        name: "لاب توب",
        price: 4999,
        description: "لاب توب عالي الأداء بمعالج Intel i7، ذاكرة 16 جيجابايت، وشاشة 15 بوصة.",
        image: "https://via.placeholder.com/600x400"
    }
];

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartModal = document.querySelector('.cart-modal');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartCount = document.querySelector('.cart-count');
const cartBtn = document.querySelector('.cart-btn');
const closeBtn = document.querySelector('.close-btn');

// Load product details
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));
const product = products.find(p => p.id === productId);

if (product) {
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `${product.price} ريال`;
    document.getElementById('product-description').textContent = product.description;
    document.querySelector('.product-image img').src = product.image;
    document.querySelector('.product-image img').alt = product.name;
} else {
    document.querySelector('.product-details').innerHTML = '<p>المنتج غير موجود!</p>';
}

// Quantity controls
const decreaseBtn = document.querySelector('.quantity-controls .decrease');
const increaseBtn = document.querySelector('.quantity-controls .increase');
const quantityInput = document.querySelector('.quantity-controls .quantity-input');

// Only attach quantity controls if product exists
if (product) {
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
}

// Add to cart
const addToCartBtn = document.querySelector('.add-to-cart-btn');
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        if (product) {
            const quantity = parseInt(quantityInput.value);
            cart.push({ name: product.name, price: product.price, quantity: quantity });
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
            alert(`${product.name} تمت إضافته إلى السلة!`);
        }
    });
}

// Buy now
const buyNowBtn = document.querySelector('.buy-now-btn');
if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
        if (product) {
            const quantity = parseInt(quantityInput.value);
            alert(`تم شراء ${product.name} بكمية ${quantity} بقيمة ${product.price * quantity} ريال بنجاح!`);
            // Optionally, redirect to checkout with only this item
        }
    });
}

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