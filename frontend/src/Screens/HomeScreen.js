import { getBanners } from '../Api/apiBanners.js';
import { getProducts } from '../Api/apiProducts.js';
import Rating from '../components/rating.js';
import { parseRequestUrl } from '../utils.js';

const HomeScreen = {
    after_render: () => {
        document.getElementById("sidebar-open-btn-m").addEventListener('click', async () => {
            document.getElementById("sidebar-container").style.display = 'flex';
        });
    },
    render: async() => {
        const {value} = parseRequestUrl();
        const products = await getProducts({});
        if(products.error) {
            return `<div class="error">${products.error}</div>`
        }
        const banners = await getBanners();
        if(banners.error) {
            return `<div class="error">${banners.error}</div>`
        }
        return `
        <div class="search-m">
            <div class="sidebar-btn-container">
                <button id="sidebar-open-btn-m" class="sidebar-open-btn">
                    <svg viewBox='0 0 10 8' width='20'>
                        <path d='M1 1h8M1 4h 8M1 7h8' 
                            stroke='#000' 
                            stroke-width='1' 
                            stroke-linecap='round'/>
                    </svg>
                </button>
            </div>
            <form class="search-form" id="search-form-m">
                <input type="text" name="q" id="q" value="${value || ''}">
                <button type="submit"><i class="fa fa-search"></i></button>
            </form>
        </div>
        ${banners.map((banner) => 
            `<div class="banner-container" id="banner">
                <div class="banner">
                    <img src="${banner.bannerImage}" alt="${banner.name}">
                    <div class="text">${banner.text}</div>
                </div>
            </div>`).join('\n')}
        <div class="hs-title">
            <h1>All Products</h1>
        </div>
        <ul class="products">
            ${products.map((product) => 
            `<li>
                <div class="product">                        
                    <a href="/#/product/${product._id}" target="_blank">
                        <div class="product-img">
                            <img src="${product.image}" alt="${product.name}">
                        </div>                              
                    </a>
                    <div class="product-name">
                        <a href="/#/product/${product._id}" target="_blank">
                            <p>${product.name}</p> 
                        </a>
                    </div>
                    <div class="product-rating">
                        ${Rating.render({
                            value: product.rating, 
                            text: `${product.numReviews === 1 ? `${product.numReviews} review` : `${product.numReviews} reviews`}`
                        })}
                    </div>
                    <div class="product-price">
                        <p>$${product.price}</p>
                    </div>
                </div>
            </li>`
        ).join('\n')}`
    },
};

export default HomeScreen;