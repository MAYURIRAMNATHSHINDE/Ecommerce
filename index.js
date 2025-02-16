const express = require("express")
require('dotenv').config()
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_API);
// let stripeGateWay=stripe(process.env.stripe_api)
const stripeGateWay = require('stripe')(process.env.STRIPE_API);

const cors = require("cors");


const app = express()

app.use(express.json())
app.use(cors());

PORT = process.env.PORT || 8080;
//app.use('/frontend', express.static(path.join(__dirname, 'frontend')))
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//success
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'success.html'));
});

//cancel
app.get('/cancel', (req, res) => {
    res.sendFile(path.join(__dirname, 'paymentCancel.html'));
});



let DOMAIN = process.env.DOMAIN;

app.post('/stripe-checkout', async (req, res) => {
    const lineItems = req.body.items.map((item) => {
        const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, '') * 100);

        console.log('item-price:', item.price);
        console.log('unitAmount:', unitAmount);
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title,
                    images: [item.productImg]
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity,

        }
    })
    console.log('lineItems:', lineItems)

    //create checkout sessions
    const session = await stripeGateWay.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `https://ecommerce-6ecq.onrender.com/success`,
        cancel_url: `https://ecommerce-6ecq.onrender.com/cancel`,

        line_items: lineItems,

        //asking address in strip checkout page

        billing_address_collection: 'required',
    });
    res.json({ url: session.url });

});


app.listen(PORT, () => {
    console.log("server started...")
})