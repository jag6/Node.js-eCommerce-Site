import Rating from '../components/rating.js';
import { parseRequestUrl } from "../utils.js";
import { getSearch } from "../Api/apiSearch.js";

const SearchScreen = {
    after_render: () => {
        
    },
    render: async() => {
        const {value} = parseRequestUrl();
        const products = await getSearch({searchKeyword: value});
        if(products.error) {
            return `<div class="error">${products.error}</div>`
        }
        return `
        <ul class="products">
            ${products.map((product) => 
            `<li>
                <div class="product">                        
                    <a href="/#/product/${product._id}">
                        <div class="product-img">
                            <img src="${product.image}" alt="${product.name}">
                        </div>                              
                    </a>
                    <div class="product-name">
                        <a href="/#/product/${product._id}">
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

export default SearchScreen;