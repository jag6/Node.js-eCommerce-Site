import { getUserInfo, setPayment } from "../localStorage.js";
import CheckoutSteps from "../components/checkoutSteps.js";

const PaymentScreen = {
    after_render: () => {
        document.getElementById("payment-form").addEventListener('submit', async (e) => {
            e.preventDefault();
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
            setPayment({paymentMethod});
            document.location.hash = '/placeorder';
        });
    },
    render: () => {
        const {name} = getUserInfo();
        if (!name) {
            document.location.hash = '/';
        }
        return `
        ${CheckoutSteps.render({step1: true, step2: true, step3: true})}
        <div class="form-container">
            <form id="payment-form" class="form">
                <h1>Payment</h1>
                <div>
                    <input type="radio" name="payment-method", id="paypal", value="Paypal" checked>
                    <img src="Images/paypal.svg" alt="paypal logo">
                    <label for="paypal">Paypal</label>
                </div>
                <div>
                    <input type="radio" name="payment-method", id="stripe", value="Stripe">
                    <img src="Images/stripe.svg" alt="stripe logo">
                    <label for="stripe">Stripe</label>
                </div>
                <button type="submit" class="primary">Continue</button>      
            </form>
        </div>
        `;
    }
};

export default PaymentScreen;