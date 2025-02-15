// Selecting elements
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#close-cart");

// Open cart
cartIcon.onclick = () => {
    cart.classList.add("active");
};

// Close cart
closeCart.onclick = () => {
    cart.classList.remove("active");
};

// Wait until DOM is fully loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

function ready() {
    loadCartItems();
    // Remove items from cart
    const removeCartButtons = document.getElementsByClassName("cart-remove");
    for (let i = 0; i < removeCartButtons.length; i++) {
        removeCartButtons[i].addEventListener("click", removeCartItem);
    }

    // Quantity change
    const quantityInputs = document.getElementsByClassName("cart-quantity");
    for (let i = 0; i < quantityInputs.length; i++) {
        quantityInputs[i].addEventListener("change", quantityChanged);
    }

    // Add to cart
    const addCartButtons = document.getElementsByClassName("add-cart");
    for (let i = 0; i < addCartButtons.length; i++) {
        addCartButtons[i].addEventListener("click", addToCart);
       
    }
}

// Remove cart item
function removeCartItem(event) {
    event.target.closest(".cart-box").remove();
    updateTotal();
    saveCartItem();
    //updateCartIcon();
}

// Quantity changed
function quantityChanged(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
    saveCartItem();
    //updateCartIcon();
}

// Add to cart function
function addToCart(event) {
    const button = event.target;
    const productBox = button.closest(".product-box");
    const title = productBox.querySelector(".product-title").innerText;
    const price = productBox.querySelector(".price").innerText;
    const productImg = productBox.querySelector(".product-img").src;

    addProductToCart(title, price, productImg);
    updateTotal();
    saveCartItem();
   // updateCartIcon();
}

function addProductToCart(title, price, productImg, isLoading = false) {
    const cartContent = document.querySelector(".cart-containt");
    const cartItems = document.getElementsByClassName("cart-product-title");

    // Prevent duplicates if not loading from localStorage
    if (!isLoading) {
        for (let i = 0; i < cartItems.length; i++) {
            if (cartItems[i].innerText === title) {
                alert("This item is already in the cart!");
                return;
            }
        }
    }

    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");

    cartBox.innerHTML = `
        <img src="${productImg}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <div class="remove-item">
            <i class='bx bx-trash cart-remove'></i>
        </div>
    `;

    cartContent.appendChild(cartBox);

    // Attach event listeners to the newly added elements
    cartBox.querySelector(".cart-remove").addEventListener("click", removeCartItem);
    cartBox.querySelector(".cart-quantity").addEventListener("change", quantityChanged);

    saveCartItem();
    updateTotal();
}

// Update total price
function updateTotal() {
    const cartBoxes = document.getElementsByClassName("cart-box");
    let total = 0;

    for (let i = 0; i < cartBoxes.length; i++) {
        const cartBox = cartBoxes[i];
        const priceElement = cartBox.querySelector(".cart-price");
        const quantityElement = cartBox.querySelector(".cart-quantity");

        const price = parseFloat(priceElement.innerText.replace("$", ""));
        const quantity = parseInt(quantityElement.value);

        total += price * quantity;
    }

    // Update total price
    document.querySelector(".total-price").innerText = "$" + total.toFixed(2);
}


//keep item in cart when page refresh with local storage.

function saveCartItem() {
    let cartContent = document.getElementsByClassName('cart-containt')[0]; // Corrected class name
    let cartBoxes = cartContent.getElementsByClassName('cart-box'); // Corrected method name
    let cartItems = [];

    for (let i = 0; i < cartBoxes.length; i++) {
        let cartBox = cartBoxes[i];

        let titleElement = cartBox.getElementsByClassName('cart-product-title')[0]; // Fixed method name
        let priceElement = cartBox.getElementsByClassName('cart-price')[0]; // Fixed 'cart' reference
        let quantityElement = cartBox.getElementsByClassName('cart-quantity')[0]; // Fixed 'cartBoxe'
        let productImg = cartBox.getElementsByClassName('cart-img')[0].src; // Fixed method name

        let item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productImg,
        };

        cartItems.push(item);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Save total to local storage
    let totalElement = document.getElementsByClassName('total-price')[0]; 
    let total = totalElement.innerText.replace("$", "").trim(); // Extract numeric value
    localStorage.setItem('cartTotal', total);
}

function loadCartItems(){
    let cartItems=localStorage.getItem('cartItems')
    if(cartItems){
        cartItems=JSON.parse(cartItems);
        for(let i=0;i<cartItems.length;i++){
            let item=cartItems[i];
            addProductToCart(item.title,item.price,item.productImg)
            let cartBoxes=document.getElementsByClassName('cart-box')
            let cartBox =cartBoxes[cartBoxes.length -1];
            let quantityElement= cartBox.getElementsByClassName('cart-quantity')[0];
            quantityElement.value= item.quantity;
        }  
    }
    let cartTotal=localStorage.getItem('cartTotal');
    if(cartTotal){
        document.getElementsByClassName('total-price')[0].innerText="$"+cartTotal
    }
  //  updateCartIcon();

}

// clear cart items after payment received

function clearCart() {
    let cartContent = document.querySelector('.cart-containt');

    if (!cartContent) {
        console.error("Cart content not found!");
        return;
    }

    // Remove all items in the cart
    cartContent.innerHTML = '';

    // Clear saved cart data in local storage
    localStorage.removeItem('cartItems');
    localStorage.removeItem('cartTotal');

    // Update the total price to $0.00
    document.querySelector(".total-price").innerText = "$0.00";
}
