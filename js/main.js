// Page state
let dessertsData = []; 
let cart = new Map();
let cartTotalQuantity = 0;
let cartTotalPrice = 0;

// Page elements
const dessertsGridEl = document.querySelector('.desserts-grid'); 


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
                    <source media="(min-width: 1024px)" srcset=${dessert.image.desktop}>
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
    dessertsGridEl.innerHTML = dessertsHtml; 
}

const cartItemsEl = document.querySelector('.cart-items'); 

const emptyCartMessageEl = document.querySelector('.empty-cart-message');


// Event delegation for dessert card buttons
dessertsGridEl.addEventListener('click', (e) => {

    const dessertCardEl = e.target.closest('.dessert-card');
    if (!dessertCardEl) return; 

    // Dessert card item
    const quantitySelector = dessertCardEl.querySelector('.cart-quantity-selector'); 
    const quantitySelectorValue = quantitySelector.querySelector('.quantity-value');
    const addToCartBtnEl = dessertCardEl.querySelector('.add-to-cart-btn'); 
    const dessertImageContainerEl = dessertCardEl.querySelector('.dessert-image-container');
    
    const selectedDessertId = dessertCardEl.dataset.id;


    // Clicking bools
    const clickedAddToCart = e.target.closest('.add-to-cart-btn'); 
    const clickedIncreaseBtn = e.target.closest('.quantity-increase-btn'); 
    const clickedDecreaseBtn = e.target.closest('.quantity-decrease-btn');


    // Add to cart
    if (clickedAddToCart) {
        addToCart(selectedDessertId); 

        addToCartBtnEl.classList.toggle('hidden'); 

        quantitySelector.classList.toggle('hidden'); 
        dessertImageContainerEl.classList.add('selected');
    }
    // Increase
    if (clickedIncreaseBtn) {
        cart.get(selectedDessertId).quantity++; 
    }
    // Decrease
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
    const addToCartBtnEl = document.querySelector(`.dessert-card[data-id="${id}"]`).querySelector('.add-to-cart-btn'); 
    const quantitySelector = document.querySelector(`.dessert-card[data-id="${id}"]`).querySelector('.cart-quantity-selector'); 
    const dessertImageContainerEl = document.querySelector(`.dessert-card[data-id="${id}"]`).querySelector('.dessert-image-container');

    addToCartBtnEl.classList.remove('hidden'); 
    quantitySelector.classList.add('hidden');
    dessertImageContainerEl.classList.remove('selected');

    cart.delete(id);
    cartItem.remove();
}


function renderCart() {
    const cartEl = document.querySelector('.cart');
    let html = "";
    const emptyCartMessageEl = cartEl.querySelector('.empty-cart-message');
    const cartItemsEl = document.querySelector('.cart-items'); 
    const cartContentEl = document.querySelector('.cart-content');
    
    const cartQuantityEl = document.querySelector('#cart-quantity');
    const cartTotalPriceEl = document.querySelector('#cart-total');

    cartTotalQuantity = 0; 
    cartTotalPrice = 0; 
    if (cart.size === 0) {
        emptyCartMessageEl.classList.remove('hidden'); 
        cartContentEl.classList.add('hidden');
    } else {
        cartContentEl.classList.remove('hidden');
        emptyCartMessageEl.classList.add('hidden'); 
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
                        <span class= "item-quantity">${cartItem.quantity}</span>x
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
    cartItemsEl.innerHTML = html;
    cartQuantityEl.textContent = cartTotalQuantity;  
    cartTotalPriceEl.textContent = cartTotalPrice.toFixed(2); 
}


const cartEl = document.querySelector('.cart');


cartEl.addEventListener('click', (e) => {
    const cartRemoveBtnEl = e.target.closest('.cart-item-remove-btn');
    if (!cartRemoveBtnEl) return; 

    const cartItemEl = cartRemoveBtnEl.closest('.cart-item'); 

    dessertId = cartItemEl.dataset.id; 
    dessert = dessertsData[dessertId]; 

    removeCartDessert(dessertId)
    renderCart()

    // TODO
    // cartQuantityEl.textContent = cartTotal; 
})



// Confirm order event
const confirmOrderBtnEl = document.querySelector('.confirm-order-btn'); 

confirmOrderBtnEl.addEventListener('click', () => {
    const modalOverlayEl = document.querySelector('.modal-overlay');

    modalOverlayEl.classList.remove('hidden');
    renderConfirmationSummary(); 
})

function renderConfirmationSummary() {
    html = "";
    const orderSummaryEl = document.querySelector('.order-summary');

    cart.forEach( (cartItem, id) => {
        const dessert = dessertsData[id]; 
        const itemTotalPrice = dessert.price * cartItem.quantity; 

        html += `          
        <div class="cart-item order-item">
            <div class="order-item-left">
              <img src="${dessert.image.thumbnail}" alt="Tiramisu image thumnail">
                <div class="cart-item-info">
                <h4 class="cart-item-title"> ${dessert.name}</h4>
                <div class="cart-item-details">
                <p class="cart-item-quantity">
                    <span class= "item-quantity">${cartItem.quantity}</span>x
                </p>
                <p class="cart-item-price"> 
                    @ $ <span class="item-price">${dessert.price.toFixed(2)} </span>
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
        <p>Order Total</p> <p class="cart-total">$<span id="cart-total">${cartTotalPrice}</span></p>
    </div>`
    orderSummaryEl.innerHTML = html; 
}


// Start new order event
const startNewOrderBtnEl = document.querySelector('.start-new-order-btn');

startNewOrderBtnEl.addEventListener('click', () => {
    resetPageUI()
})

function resetPageUI() {
    cart.clear();
    renderCart();
    renderConfirmationSummary();

    const emptyCartMessageEl = cartEl.querySelector('.empty-cart-message');
    const cartContentEl = document.querySelector('.cart-content');
    const modalOverlayEl = document.querySelector('.modal-overlay');

    emptyCartMessageEl.classList.remove('hidden'); 
    cartContentEl.classList.add('hidden');
    modalOverlayEl.classList.add('hidden');
}