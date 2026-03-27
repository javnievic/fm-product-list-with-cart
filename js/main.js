
// Page state
let dessertsData = []; 

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

