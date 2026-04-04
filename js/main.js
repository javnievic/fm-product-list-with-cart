// Page state
let dessertsData = []; 
let cart = new Map();
let cartTotalQuantity = 0;
let cartTotalPrice = 0;


// DOM elements
const DOM = {
    dessertsGrid: document.querySelector('.desserts-grid'),
    cart: document.querySelector('.cart'),
    cartItems: document.querySelector('.cart-items'),
    cartContent: document.querySelector('.cart-content'),
    emptyCartMessage: document.querySelector('.empty-cart-message'),
    cartQuantity: document.querySelector('#cart-quantity'),
    cartTotal: document.querySelector('#cart-total'),
    confirmOrderBtn: document.querySelector('.confirm-order-btn'),
    startNewOrderBtn: document.querySelector('.start-new-order-btn'),
    modalOverlay: document.querySelector('.modal-overlay'),
    orderSummary: document.querySelector('.order-summary')
}


fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        dessertsData = data;
        renderDesserts(data);
    })
    .catch(err => console.error("Failed to load desserts:", err))


function renderDesserts(desserts) {
    let dessertsHtml = ""
    let dessertId = 0; 

    desserts.forEach(dessert => {
        dessertsHtml += `
        <div class="dessert-card" data-id=${dessertId}>
            <div class="dessert-image-container">
                <picture>
                    <source media="(min-width: 1200px)" srcset=${dessert.image.desktop}>
                    <source media="(min-width: 768px)" srcset=${dessert.image.tablet}>
                    <img src=${dessert.image.mobile} alt="${dessert.name} image">
                </picture>
                <button class="add-to-cart-btn" data-id=${dessertId}> 
                    <img src="/assets/images/icon-add-to-cart.svg" alt="Add to cart">
                    <p>Add to Cart</p>
                </button>
                
                <div class="cart-quantity-selector hidden">
                    <button class="quantity-decrease-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2">
                            <path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/>
                        </svg>
                    </button>
                    <span class="quantity-value">1</span>
                    <button class="quantity-increase-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                            <path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/>
                        </svg>
                    </button>
                </div>
                
            </div>

            <div class="dessert-info">
                <h3 class="dessert-category">${dessert.category}</h3>
                <p class="dessert-name">${dessert.name}</p>
                <p class="dessert-price">$${dessert.price.toFixed(2)}</p>
            </div>
        </div> 
        `;
        dessertId +=1; 
    });

    DOM.dessertsGrid.innerHTML = dessertsHtml; 
}


// Event delegation for dessert card buttons
DOM.dessertsGrid.addEventListener('click', (e) => {

    const dessertCardEl = e.target.closest('.dessert-card');
    const selectedDessertId = dessertCardEl.dataset.id;
    if (!dessertCardEl) return; // If not clicked the dessert card 

    // Cart elements
    const quantitySelector = dessertCardEl.querySelector('.cart-quantity-selector'); 
    const quantitySelectorValue = quantitySelector.querySelector('.quantity-value');
    const addToCartBtnEl = dessertCardEl.querySelector('.add-to-cart-btn'); 
    const dessertImageContainerEl = dessertCardEl.querySelector('.dessert-image-container');

    // Clicking bools
    const clickedAddToCart = e.target.closest('.add-to-cart-btn'); 
    const clickedIncreaseBtn = e.target.closest('.quantity-increase-btn'); 
    const clickedDecreaseBtn = e.target.closest('.quantity-decrease-btn');

    if (clickedAddToCart) {
        addToCart(selectedDessertId); 

        addToCartBtnEl.classList.toggle('hidden'); 
        quantitySelector.classList.toggle('hidden'); 
        dessertImageContainerEl.classList.add('selected');
    }
    if (clickedIncreaseBtn) {
        cart.get(selectedDessertId).quantity++; 
    }
    if (clickedDecreaseBtn) {
        cart.get(selectedDessertId).quantity--;

        if (cart.get(selectedDessertId).quantity === 0) {
            removeCartDessert(selectedDessertId); 
        }
    }

    renderCart(); 
    quantitySelectorValue.textContent = cart.get(selectedDessertId).quantity;
})


function addToCart(id) {
    cart.set(id, {quantity: 1, price: dessertsData[id].price}); 
}


function removeCartDessert(id) {
    const cartItem = document.querySelector(`.cart-item[data-id="${id}"]`); 
    const card = document.querySelector(`.dessert-card[data-id="${id}"]`);

    const addToCartBtnEl = card.querySelector('.add-to-cart-btn'); 
    const quantitySelector = card.querySelector('.cart-quantity-selector'); 
    const dessertImageContainerEl = card.querySelector('.dessert-image-container');

    addToCartBtnEl.classList.remove('hidden'); 
    quantitySelector.classList.add('hidden');
    dessertImageContainerEl.classList.remove('selected');

    cart.delete(id);

    if (cartItem) cartItem.remove();
}


function renderCart() {
    let html = "";

    cartTotalQuantity = 0; 
    cartTotalPrice = 0; 

    if (cart.size === 0) {
        DOM.emptyCartMessage.classList.remove('hidden'); 
        DOM.cartContent.classList.add('hidden');
    } 
    else {
        DOM.cartContent.classList.remove('hidden');
        DOM.emptyCartMessage.classList.add('hidden'); 

        cart.forEach((cartItem, id) => {

            const dessert = dessertsData[id];
            const itemTotalPrice = dessert.price * cartItem.quantity; 

            cartTotalQuantity += cartItem.quantity;
            cartTotalPrice += itemTotalPrice;

            html += `
            <div class="cart-item" data-id="${id}">
                <div class="cart-item-info">
                    <h4 class="cart-item-title"> ${dessert.name}</h4>
                    <div class="cart-item-details">
                    <p class="cart-item-quantity">
                        <span class="item-quantity">${cartItem.quantity}</span>x
                    </p>
                    <p class="cart-item-price"> 
                        @ $ <span class="item-price">${dessert.price.toFixed(2)}</span>
                    </p>
                    <p class="cart-item-total">
                        $ <span class="item-total-price">${itemTotalPrice.toFixed(2)}</span>
                    </p>
                    </div>
                </div>
                <button class="cart-item-remove-btn" aria-label="Remove item">
                    <svg width="10" height="10" fill="none" viewBox="0 0 10 10">
                    <path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
                    </svg>
                </button>
            </div>
            <hr>
        `;
        })
    }

    DOM.cartItems.innerHTML = html;
    DOM.cartQuantity.textContent = cartTotalQuantity;  
    DOM.cartTotal.textContent = cartTotalPrice.toFixed(2); 
}


DOM.cart.addEventListener('click', (e) => {

    const cartRemoveBtnEl = e.target.closest('.cart-item-remove-btn');
    if (!cartRemoveBtnEl) return; 

    const cartItemEl = cartRemoveBtnEl.closest('.cart-item'); 

    const dessertId = cartItemEl.dataset.id; 

    removeCartDessert(dessertId)
    renderCart()
})


// Confirm order event
DOM.confirmOrderBtn.addEventListener('click', () => {

    DOM.modalOverlay.classList.remove('hidden');
    renderConfirmationSummary(); 
})


function renderConfirmationSummary() {

    let html = "";

    cart.forEach((cartItem, id) => {

        const dessert = dessertsData[id]; 
        const itemTotalPrice = dessert.price * cartItem.quantity; 

        html += `          
        <div class="cart-item order-item">
            <div class="order-item-left">
              <img src="${dessert.image.thumbnail}" alt="${dessert.name} image thumbnail">
                <div class="cart-item-info">
                <h4 class="cart-item-title"> ${dessert.name}</h4>
                <div class="cart-item-details">
                <p class="cart-item-quantity">
                    <span class="item-quantity">${cartItem.quantity}</span>x
                </p>
                <p class="cart-item-price"> 
                    @ $ <span class="item-price">${dessert.price.toFixed(2)}</span>
                </p>
                </div>
              </div>
            </div>
            <p class="cart-item-total">
                $ <span class="item-total-price">${itemTotalPrice.toFixed(2)}</span>
            </p>
          </div>
          <hr>
        `
    })

    html += `          
    <div class="cart-summary">
        <p>Order Total</p>
        <p class="cart-total">$<span>${cartTotalPrice}</span></p>
    </div>`

    DOM.orderSummary.innerHTML = html; 
}


// Start new order
DOM.startNewOrderBtn.addEventListener('click', () => {
    resetPageUI()
})


function resetPageUI() {

    cart.clear();

    renderCart();
    renderConfirmationSummary();

    DOM.modalOverlay.classList.add('hidden');

    document.querySelectorAll('.dessert-card').forEach(card => {

        const addBtn = card.querySelector('.add-to-cart-btn');
        const selector = card.querySelector('.cart-quantity-selector');
        const imageContainer = card.querySelector('.dessert-image-container');

        addBtn.classList.remove('hidden');
        selector.classList.add('hidden');
        imageContainer.classList.remove('selected');
    });
}