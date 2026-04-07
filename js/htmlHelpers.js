

export function createDessertCardHTML(dessert, id) {
    return `
        <div class="dessert-card" data-id=${id}>
            <div class="dessert-image-container">
                <picture>
                    <source media="(min-width: 1200px)" srcset=${dessert.image.desktop}>
                    <source media="(min-width: 768px)" srcset=${dessert.image.tablet}>
                    <img src=${dessert.image.mobile} alt="${dessert.name} image">
                </picture>
                <button class="add-to-cart-btn" data-id=${id}> 
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
        `
}

export function createCartItemHTML(cartItem, id, dessert) {
    const itemTotalPrice = dessert.price * cartItem.quantity; 

    return `<div class="cart-item" data-id="${id}">
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
}

export function createConfirmationSummaryHTML(cartItem, dessert) {
    const itemTotalPrice = dessert.price * cartItem.quantity; 

    return `          
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
}