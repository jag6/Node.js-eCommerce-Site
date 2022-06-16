import { getProduct } from "../Api/apiProducts.js";
import Header from "../components/header.js";
import { getCartItems, setCartItems } from "../localStorage.js";
import { parseRequestUrl, rerender, rerenderHeader } from "../utils.js";

const addToCart = (item, forceUpdate = false) => {
    let cartItems = getCartItems();
    const existItem = cartItems.find((x) => x.product === item.product);
    if(existItem) {
        if(forceUpdate) {
            cartItems = cartItems.map((x) => x.product === existItem.product? item: x);
        }
    }else{
        cartItems = [...cartItems, item];
    }
    setCartItems(cartItems);
    if(forceUpdate) {
        rerender(CartScreen);
        rerenderHeader(Header);
    }
};

const removeFromCart = (id) => {
    setCartItems(getCartItems().filter((x) => x.product !== id));
    if(id === parseRequestUrl().id) {
        document.location.hash = '/cart';
    }else {
        rerender(CartScreen);
        rerenderHeader(Header);
    }
};

const CartScreen = {
    after_render: () => {
        const qtySelects = document.getElementsByClassName("qty-select");
            Array.from(qtySelects).forEach((qtySelect) => {
            qtySelect.addEventListener('change', (e) => {
                const item = getCartItems().find((x) => x.product === qtySelect.id);
                addToCart({ ...item, qty: Number(e.target.value)}, true);
            });
        });
        const deleteButtons = document.getElementsByClassName("delete-btn");
        Array.from(deleteButtons).forEach(deleteButton => {
            deleteButton.addEventListener('click', () => {
                removeFromCart(deleteButton.id);
            });
        });
        document.getElementById("checkout-btn").addEventListener('click', () => {
            document.location.hash = '/signin';
        })
        document.getElementById("continue-shopping-btn").addEventListener('click', () => {
            document.location.hash = '/';
        })
    },    
    render: async () => {
        rerenderHeader(Header);
        const request = parseRequestUrl();
        if(request.id) {
            const product = await getProduct(request.id);
            addToCart({
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                countInStock: product.countInStock,
                qty: 1
            });
        }
        const cartItems = getCartItems();
        return `
            <div class="cart">
                <div class="cart-list">
                    <ul class="cart-list-container">
                        <li>
                            <h2>Shopping Cart</h2>
                            <div><h3>Price</h3></div>
                        </li>
                        ${
                            cartItems.length === 0?
                            '<div>Cart is Empty. Click <a href="/#/"><b>Here</b></a> to Start Shopping!':
                            cartItems.map(item => `
                            <li>
                                <a href="/#/product/${item.product}"}>
                                    <div class="cart-img">
                                        <img src="${item.image}" alt="${item.name}">
                                    </div>
                                </a>
                                <div class="cart-name">
                                    <div>
                                        <a href="/#/product/${item.product}"}>
                                        ${item.name}
                                        </a>
                                    </div>
                                    <div>
                                        Qty: 
                                        <select class="qty-select" id="${item.product}">
                                            ${
                                                [...Array(item.countInStock).keys()].map((x) => item.qty === x + 1?
                                                    `<option selected value="${x + 1}">${x + 1}</option>`:
                                                    `<option value="${x + 1}">${x + 1}</option>`
                                            )}
                                        </select>
                                        <button type="button" class="delete-btn" id="${item.product}">
                                        Delete</button>
                                    </div>
                                </div>
                                <div class="cart-price">
                                    $${item.price}
                                </div>
                            </li>
                            `).join('\n')
                        }
                    </ul>
                </div>
                <div class="cart-action">
                    <h3>
                        Subtotal (${cartItems.reduce((a, c) => a + c.qty, 0)} items):
                        $${cartItems.reduce((a, c) => a + c.price* c.qty, 0)}
                    </h3>
                    <button id="checkout-btn" class="primary fw">
                        Proceed to Checkout
                    </button>
                    <button id="continue-shopping-btn" class="primary fw">
                        Continue Shopping
                    </button>
                </div>
            </div>
        `;
    },
};

export default CartScreen;