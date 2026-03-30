// Page state
let dessertsData = []; 
let cart = {};
let cartTotal = 0;

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
                <p class="dessert-price">$${dessert.price}</p>
            </div>
        </div> 
        `;
        dessertId +=1; 
    });
    dessertsGridEl.innerHTML = dessertsHtml; 
}

// Event delegation for dessert card buttons
dessertsGridEl.addEventListener('click', (e) => {

    const dessertCardEl = e.target.closest('.dessert-card');
    if (!dessertCardEl) return; 

    // Dessert card item
    const quantitySelector = dessertCardEl.querySelector('.cart-quantity-selector'); 
    const quantitySelectorValue = quantitySelector.querySelector('.quantity-value');
    const addToCartBtnEl = dessertCardEl.querySelector('.add-to-cart-btn'); 
    
    
    const selectedDessertId = dessertCardEl.dataset.id;
    const selectedDessert = dessertsData[selectedDessertId]; 

    
    // Cart item
    const cartQuantityEl = document.querySelector('#cart-quantity');
    const cartItemsEl = document.querySelector('.cart-items'); 

    // Clicking bools
    const clickedAddToCart = e.target.closest('.add-to-cart-btn'); 
    const clickedIncreaseBtn = e.target.closest('.quantity-increase-btn'); 
    const clickedDecreaseBtn = e.target.closest('.quantity-decrease-btn');


    // Add to cart
    if (clickedAddToCart) {
        addToCart(selectedDessertId); 

        addToCartBtnEl.classList.toggle('hidden'); 
        quantitySelector.classList.toggle('hidden'); 

        cartItemsEl.innerHTML += `
            <div class="cart-item" data-id="${selectedDessertId}">
            <div class="cart-item-info">
                <h4 class="cart-item-title"> ${selectedDessert.name}</h4>
                <div class="cart-item-details">
                <p class="cart-item-quantity">
                    <span class= "item-quantity">1</span>x
                </p>
                <p class="cart-item-price"> 
                    @ $ <span class="item-price">${selectedDessert.price.toFixed(2)}</span>
                </p>
                <p class="cart-item-total">
                    $ <span class="item-total-price">${selectedDessert.price.toFixed(2)}</span>
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
    }
    // Increase
    if (clickedIncreaseBtn) {
        cart[selectedDessertId].quantity++; cartTotal++; 
    }
    // Decrease
    if (clickedDecreaseBtn) {
        cart[selectedDessertId].quantity--; cartTotal--; 
        if (cart[selectedDessertId].quantity === 0) {
            removeCartDessert(selectedDessertId); 
            return; 
        }      
    }
    quantitySelectorValue.textContent = cart[selectedDessertId].quantity;
    updateCartItemUI(selectedDessertId); 
    cartQuantityEl.textContent = cartTotal; 
})


function addToCart(id) {
    cart[id] = { quantity: 1, price: dessertsData[id].price}; 
    cartTotal++;
}

function updateCartItemUI(id) {
    const cartItem =  document.querySelector(`.cart-item[data-id = "${id}"]`);
    const totalPrice = cartItem.querySelector(".item-total-price");
    const quantity = cartItem.querySelector(".item-quantity");
    
    totalPrice.textContent = (cart[id].quantity * cart[id].price).toFixed(2);
    quantity.textContent = cart[id].quantity; 

}

function removeCartDessert(id) {
    const cartItem = document.querySelector(`.cart-item[data-id="${id}"]`); 
    const addToCartBtnEl = document.querySelector(`.dessert-card[data-id="${id}"]`).querySelector('.add-to-cart-btn'); 
    const quantitySelector = document.querySelector(`.dessert-card[data-id="${id}"]`).querySelector('.cart-quantity-selector'); 

    cartTotal = cartTotal - cart[id].quantity;

    addToCartBtnEl.classList.remove('hidden'); 
    quantitySelector.classList.add('hidden');

    delete cart[id];
    cartItem.remove();
}


const cartEl = document.querySelector('.cart');


cartEl.addEventListener('click', (e) => {
    const cartRemoveBtnEl = e.target.closest('.cart-item-remove-btn');
    if (!cartRemoveBtnEl) return; 

    const cartItemEl = cartRemoveBtnEl.closest('.cart-item'); 

    dessertId = cartItemEl.dataset.id; 
    dessert = dessertsData[dessertId]; 

    removeCartDessert(dessertId)

    // TODO
    // cartQuantityEl.textContent = cartTotal; 
})



