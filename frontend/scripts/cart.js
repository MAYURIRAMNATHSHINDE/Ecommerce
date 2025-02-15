
document.addEventListener("DOMContentLoaded", () => {
    const payBtn = document.querySelector('.buy-btn'); 

    if (!payBtn) {
        console.error("payBtn not found!");
        return;
    }

    payBtn.addEventListener('click', async () => {
        const cartItems = localStorage.getItem('cartItems');
        const parsedItems = JSON.parse(cartItems);
        if (!parsedItems || parsedItems.length === 0) {
            console.error("No items in the cart!");
            return;
        }
        

       // console.log("Sending cartItems:", JSON.parse(cartItems));

        try {
            const response = await fetch('http://localhost:8080/stripe-checkout', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: parsedItems })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Stripe session URL:", data.url);

            if (data.url) {
                window.location.href = data.url;
                clearCart();
                // saveCartItem()
            } else {
                console.error("Stripe session URL is missing!");
            }
        } catch (error) {
            console.error("Error during payment:", error);
        }
    });
});
