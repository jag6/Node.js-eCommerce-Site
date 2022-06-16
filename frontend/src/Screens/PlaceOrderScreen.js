import { cleanCart, getCartItems, getPayment, getShipping } from "../localStorage.js";
import CheckoutSteps from "../components/checkoutSteps.js";
import { hideLoading, showLoading, showMessage } from "../utils.js";
import { createOrder } from "../Api/apiOrders.js";

const convertCartToOrder = () => {
    const orderItems = getCartItems();
    if(orderItems.length === 0) {
        document.location.hash = '/cart';
    }
    const shipping = getShipping();
    if(!shipping.address) {
        document.location.hash = '/shipping';
    }
    const payment = getPayment();
    if(!payment.paymentMethod) {
        document.location.hash = '/payment';
    }
    const itemsPrice = orderItems.reduce((a, c) => a + c.price * c.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Math.round(0.15 * itemsPrice * 100) / 100;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    return {
        orderItems,
        shipping,
        payment,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    };
};

const PlaceOrderScreen = {
    after_render: async () => {
        document.getElementById("placeorder-btn").addEventListener('click', async () => {
            const order = convertCartToOrder();
            showLoading(); 
            const data = await createOrder(order);
            hideLoading(); 
            if(data.error) {
                showMessage(data.error);
            }else {
                cleanCart();
                document.location.hash = `/order/${data.order._id}`;
            }
        });
    },
    render: () => {
        const { 
            orderItems,
            shipping,
            payment,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        } = convertCartToOrder();
        return `
        <div>
            ${CheckoutSteps.render({step1: true, step2: true, step3: true, step4: true})}    
            <div class="order">
                <div class="order-info">
                    <div class="shipping-info">
                        <div>
                            <h2>Shipping</h2>
                        </div>
                        <div>
                            <p>${shipping.address}, ${shipping.city}, ${shipping.postalCode}, ${shipping.country}</p>
                        </div>
                    </div>
                    <div class="payment-info">
                        <div>
                            <h2>Payment</h2>
                        </div>
                        <div>
                            <p>Payment Method: ${payment.paymentMethod}</p>
                        </div>
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
                        <button id="placeorder-btn" class="primary fw">Place Order</button>
                    </div> 
                </div>                               
            </div>
        </div>
        `;
    },
};

export default PlaceOrderScreen;