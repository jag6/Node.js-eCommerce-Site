import { createProduct, deleteProduct, getProducts } from "../Api/apiProducts.js";
import DashboardMenu from "../components/dashboardMenu.js";
import { hideLoading, rerender, showLoading, showMessage } from "../utils.js";

const ProductListScreen = {
    after_render: () => {
        document.getElementById("create-product-btn").addEventListener('click', async () => {
            const data = await createProduct();
            document.location.hash = `/product/${data.product._id}/edit`;
        });
        const editButtons = document.getElementsByClassName('edit-btn');
        Array.from(editButtons).forEach((editBtn) => {
            editBtn.addEventListener('click', () => {
                document.location.hash = `/product/${editBtn.id}/edit`;
            });
        });
        const deleteButtons = document.getElementsByClassName('delete-btn');
        Array.from(deleteButtons).forEach((deleteBtn) => {
            deleteBtn.addEventListener('click', async () => {
                if(confirm('Are you sure you want to delete this product?')) {
                    showLoading();
                    const data = await deleteProduct(deleteBtn.id);
                    if(data.error) {
                        showMessage(data.error);
                    }else {
                        rerender(ProductListScreen);
                    }
                    hideLoading();
                }
            });
        })
    },
    render: async () => {
        const products = await getProducts({});
        return `
        <div class="dashboard content">
            ${DashboardMenu.render({selected: 'products'})}
            <div class="dashboard-content">
                <div class="dp-list-header">    
                    <h1>Product List</h1>
                    <div class="cpb"><button id="create-product-btn" class="primary bold">Create Product</button></div>
                </div>
                <div class="table-small-screen">
                    <p>Screen width is too small. Please flip your mobile device over to view table.<p>
                </div>
                <div class="product-list list">
                    <table>
                        <thead> 
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th class="tr-action">PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th class="tr-action">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${products.map(product => `
                            <tr>
                                <td>${product._id}</td>
                                <td>${product.name}</td>
                                <td>${product.price}</td>
                                <td>${product.category}</td>
                                <td>${product.brand}</td>
                                <td>
                                    <button id="${product._id}" class="edit-btn">Edit</button>
                                    <button id="${product._id}" class="delete-btn">Delete</button>
                                </td>
                                `).join('\n')
                            }
                        </tbody>
                    <table>
                </div>
            </div>
        </div>
        `;
    }
};

export default ProductListScreen;