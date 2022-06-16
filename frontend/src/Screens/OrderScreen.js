import { hideLoading, parseRequestUrl, rerender, showLoading, showMessage } from "../utils.js";
import { deliverOrder, getOrder, getPayPalClientId, payOrder } from "../Api/apiOrders.js";
import { getUserInfo } from "../localStorage.js";


const addPaypalSdk = async (totalPrice) => {
    const clientId = await getPayPalClientId();
    showLoading(); 
    if(!window.paypal) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.paypalobjects.com/api/checkout.js';
        script.async = true;
        script.onload = () => handlePayment(clientId, totalPrice);
        document.body.appendChild(script);
    }else {
        handlePayment(clientId, totalPrice);
    }
};

const handlePayment = (clientId, totalPrice) => {
    window.paypal.Button.render({
        env: 'sandbox',
        client: {
            sandbox: clientId, 
            production: ''
        },
        locale: 'en_US',
        style: {
            size: 'responsive',
            color: 'gold',
            shape: 'pill'
        },
        commit: true,
        payment(data, actions){
            return actions.payment.create({
                transactions: [
                    {
                        amount: {
                            total: totalPrice,
                            currency: 'USD'
                        }
                    }
                ]
            });
        },
        onAuthorize(data, actions){
            return actions.payment.execute().then(async () => {
                showLoading(); 
                await payOrder(parseRequestUrl().id, {
                    orderId: data.orderId,
                    payerID: data.payerID,
                    paymentID: data.paymentID
                });
                hideLoading();
                showMessage('Payment was successful', () => {
                    rerender(OrderScreen);
                });
            });
        },
    },
    '#paypal-btn').then(() => {
        hideLoading();
    });
};

const OrderScreen = {
    after_render: async () => {
        const request = parseRequestUrl();
        if(document.getElementById("deliver-order-btn")) {
            document.addEventListener('click', async () => {
                showLoading();
                await deliverOrder(request.id);
                hideLoading();
                showMessage('Order Delivered', () => {
                    rerender(OrderScreen);
                })
            });
        }
    },
    render: async () => {
        const {isAdmin} = getUserInfo();
        const request = parseRequestUrl();
        const {
            _id,
            shipping,
            payment,
            orderItems,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            isDelivered,
            deliveredAt,
            isPaid,
            paidAt
        } = await getOrder(request.id);
        if(!isPaid) {
            addPaypalSdk(totalPrice)
        }
        return `
        <div>
            <div class="order-header"><h1>Order <span class="smaller">#${_id}</span></h1></div>
            <div class="order">
                <div class="order-info">
                    <div class="shipping-info">
                        <div>
                            <h2>Shipping</h2>
                        </div>
                        <div>
                            <p>${shipping.address}, ${shipping.city}, ${shipping.postalCode}, ${shipping.country}</p>
                        </div>
                        ${
                            isDelivered
                            ? `<div class="success"><p>Delivered at ${deliveredAt}</p></div>`
                            : `<div class="error"><p>Not Delivered</p></div>`
                        }
                    </div>
                    <div class="payment-info">
                        <div>
                            <h2>Payment</h2>
                        </div>
                        <div>
                            <p>Payment Method: ${payment.paymentMethod}</p>
                        </div>
                        ${
                            isPaid
                            ? `<div class="success"><p>Paid at ${paidAt}</p></div>`
                            : `<div class="error"><p>Not Paid</p></div>`
                        }
                    </div>
                    <div>
                        <ul class="cart-list-container">
                            <li>
                                <h2>Shopping Cart</h2>
                                <div><h3>Price</h3></div>
                            </li>
                            ${
                                orderItems.map(item => `
                                <li>
                                    <a href="/#/product/${item.product}"}>
                                        <div class="cart-img">
                                            <img src="${item.image}" alt="${item.name}">
                                        </div>
                                    </a>
                                    <div class="cart-name">
                                        <div>
                                            <a href="/#/product/${item.product}">${item.name}</a>
                                        </div>
                                        <div>Qty: ${item.qty} </div>
                                    </div>
                                    <div class="cart-price">$${item.price}</div>
                                </li>
                                `
                                ).join('\n')}
                        </ul> 
                    </div>
                </div>
                <div class="order-action">
                    <div class="order-action-header">
                        <h2>Order Summary</h2>
                    </div>
                    <div class="place-order-info">
                        <div><h3>Items:</h3><h3>$${itemsPrice}</h3></div>
                        <div><h3>Shipping:</h3><h3>$${shippingPrice}</h3></div>
                        <div><h3>Tax:</h3><h3>$${taxPrice}</h3></div>
                        <div><h3 id="last-h3">Order Total:</h3><h3 id="last-h3-2">$${totalPrice}</h3></div> 
                        <div id="paypal-btn" class="fw"></div>
                        ${
                            isPaid && !isDelivered && isAdmin
                            ?`<button id="deliver-order-btn" class="primary fw">Deliver Order</button>`
                            : ''
                        }
                    </div> 
                </div>                               
            </div>
        </div>
        `;
    },
};

export default OrderScreen;

