
// Page state
let dessertsData = []; 

// Page elements
const dessertsGridEl = document.querySelector('.desserts-grid'); 
const addToCardBtnEl = document.querySelector('.add-to-cart-btn')


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

    dessertsData.forEach(dessert => {
        dessertsHtml += `
        <div class="dessert-card" data-id=${dessertId}>
            <div class="dessert-image-container">
                <picture>
                    <source media="(min-width: 1024px)" srcset=${dessert.image.desktop}>
                    <source media="(min-width: 768px)" srcset=${dessert.image.tablet}>
                    <img src=${dessert.image.mobile} alt="${dessert.name} image">
                </picture>
                <button class="add-to-cart-btn"> 
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


addToCardBtnEl.addEventListener('click', (e) => {

    })
