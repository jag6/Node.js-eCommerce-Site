import { getUserInfo, getCartItems } from "../localStorage.js";
import { parseRequestUrl } from "../utils.js";

const Header = {
    after_render: () => {
        document.getElementById("search-form").addEventListener('submit', async (e) => {
            e.preventDefault();
            const searchKeyword = document.getElementById("q").value;
            document.location.hash = `/search/?q=${searchKeyword}`;
        });
        document.getElementById("sidebar-open-btn").addEventListener('click', async () => {
            document.getElementById("sidebar-container").style.display = 'flex';
        });
    },
    render: () => {
        const {name, isAdmin} = getUserInfo();
        const {value} = parseRequestUrl();
        const cartItems = getCartItems();
        return `
            <a href="/#/">
                <div class="brand">
                    <img src="Images/store.svg" alt="store">
                    <p>i-Store</p>
                </div>
            </a>
            <div class="search">
                <div class="sidebar-btn-container">
                    <button id="sidebar-open-btn" class="sidebar-open-btn">
                        <svg viewBox='0 0 10 8' width='20'>
                            <path d='M1 1h8M1 4h 8M1 7h8' 
                                stroke='#000' 
                                stroke-width='1' 
                                stroke-linecap='round'/>
                         </svg>
                    </button>
                </div>
                <form class="search-form" id="search-form">
                    <input type="text" name="q" id="q" value="${value || ''}">
                    <button type="submit"><i class="fa fa-search"></i></button>
                </form>
            </div>
            <div class="header-other">
                <div class="profile-signin">
                    ${
                        name 
                        ? `<a href="/#/profile">${name}</a>`
                        : `<a href="/#/signin">Sign-In</a>`
                    }
                </div>
                <a id="cart-icon" href="/#/cart">
                    <div class="header-cart">
                        <img src="Images/cart.svg" alt="shopping cart">
                        <p>${cartItems.reduce((a, c) => a + c.qty, 0)}</p>
                    </div>
                </a>
                <div class="header-dashboard">
                    ${isAdmin ? `<a href="/#/dashboard">Dashboard</a>` : '' }
                </div>
            </div>`;
    }
};

export default Header;