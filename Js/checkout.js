let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartCount = document.querySelector('.cart-count');
const confirmBtn = document.querySelector('.confirm-btn');

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
            cart.splice(index, 1); // Remove item from cart
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        });
    });

    document.querySelectorAll('.cart-item .buy-now-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            const item = cart[index];
            alert(`تم شراء ${item.name} بكمية ${item.quantity} بقيمة ${item.price * item.quantity} ريال بنجاح!`);
            cart.splice(index, 1); // Remove item after purchase
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        });
    });

    cartTotal.textContent = `الإجمالي: ${total} ريال`;
    cartCount.textContent = totalItems;
}

// Confirm purchase
confirmBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const payment = document.getElementById('payment').value;

    if (!name || !address || !phone || !payment) {
        alert('يرجى ملء جميع الحقول!');
        return;
    }

    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }

    alert('تم تأكيد الشراء بنجاح!');
    cart.length = 0; // Clear cart
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    document.getElementById('name').value = '';
    document.getElementById('address').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('payment').value = '';
});

// Initial cart update
updateCart();