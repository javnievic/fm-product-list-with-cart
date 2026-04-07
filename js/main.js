import {createDessertCardHTML, createCartItemHTML, createConfirmationSummaryHTML} from './htmlHelpers.js'

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
        dessertsHtml += createDessertCardHTML(dessert, dessertId);
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

    cartItem?.remove();
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

            html +=  createCartItemHTML(cartItem, id, dessert);
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

        html += createConfirmationSummaryHTML(cartItem, dessert);
    })

    html += `          
    <div class="cart-summary">
        <p>Order Total</p>
        <p class="cart-total">$<span>${cartTotalPrice.toFixed(2)}</span></p>
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