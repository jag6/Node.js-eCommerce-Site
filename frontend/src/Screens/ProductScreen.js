import { hideLoading, parseRequestUrl, rerender, showLoading, showMessage } from "../utils.js";
import { createReview, getProduct } from "../Api/apiProducts.js";
import Rating from "../components/rating.js";    
import { getUserInfo } from "../localStorage.js";                                             

const ProductScreen = {
    after_render: () => {
        const request = parseRequestUrl();
        document.getElementById("add-btn").addEventListener('click', () => {
            document.location.hash = `/cart/${request.id}`;
        });
        if(document.getElementById("review-form")) {
            document.getElementById("review-form").addEventListener('submit', async (e) => {
                e.preventDefault();
                showLoading();
                const data = await createReview(request.id, {
                    comment: document.getElementById("comment").value,
                    rating: document.getElementById("rating").value,
                });
                hideLoading();
                if (data.error) {
                    showMessage(data.error);
                }else {
                    showMessage('Review Added Successfully', () => {
                        rerender(ProductScreen);
                    });
                }
            });
        }
    },
    render: async () => {
        const request = parseRequestUrl();
        const product = await getProduct(request.id);
        if(product.error) {
            return(`<div>${product.error}</div>`)
        }
        const userInfo = getUserInfo();
        return `
        <div class="content">
            <div class="back-to-result">
                <a href="JavaScript:window.close()" ><i class="arrow-left"></i>Back</a>
            </div>
            <div class="details">
                <div class="details-img">
                    <img src="${product.image}" alt="{product.name}">
                </div>
                <div class="details-info">
                    <ul>
                        <li>
                            <h1>${product.name}</h1>
                        </li>
                        <li>
                            ${Rating.render({value: product.rating, text: `${product.numReviews === 1 ? `${product.numReviews} review` : `${product.numReviews} reviews`}`})}
                        </li>
                        <li>
                            Price: <strong>$${product.price}</strong>
                        </li>
                        <li>
                            Description:
                            <div>
                                ${product.description}
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="details-action">
                    <ul>
                        <li>
                        Price: $${product.price}
                        </li>
                        <li>
                        Status: ${product.countInStock > 0 ? `<span class="success">In Stock</span>`:
                        `<span class="error">Unavailable</span>`}
                        </li>
                        <li>
                            <button id="add-btn" class="fw primary">Add to Cart</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="reviews-container">
                ${
                    userInfo.name
                    ? `
                        <div class="form-container">
                            <form id="review-form" class="form">
                                <h3>Write a Review</h3>
                                <label for="rating">Rating</label>
                                <select required name="rating" id="rating">
                                    <option value="">Select</option>
                                    <option value="1">1 = Poor</option>
                                    <option value="2">2 = Fair</option>
                                    <option value="3">3 = Good</option>
                                    <option value="4">4 = Very Good</option>
                                    <option value="5">5 = Excellent</option>
                                </select>
                                <label for="comment">Comment</label>
                                <textarea required name="comment" id="comment" cols="30" rows="5"></textarea>
                                <button type="submit" class="primary bold">SUBMIT</button>
                            </form>
                        </div>`
                    : `<div class="all-reviews">Please Sign In <a href="/#/signin"><span class="bold">HERE</span></a> to write a review</div>`
                }
                <div class="all-reviews">
                    <div class="reviews-header"><h2>Reviews</h2></div>
                    ${
                        product.reviews.length === 0
                        ? `<div>No Reviews</div>`
                        : ''
                    }
                    <ul class="reviews">
                    ${product.reviews.map((review) =>
                        `<li>
                            <div><h3>${review.name}</h3></div>
                            <div class="rating-container">
                            ${Rating.render({
                                value: review.rating
                            })}
                                <div><h4>${review.createdAt.substring(0, 10)}</h4></div>
                            
                                <div><h4>${review.comment}</h4></div>
                            </div>
                        </li>
                        <div class="line"></div>`
                ).join('\n')}
                </div>
            </div>
        </div>`;
    },
};

export default ProductScreen;