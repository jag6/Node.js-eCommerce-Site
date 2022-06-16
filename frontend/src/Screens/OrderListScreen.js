import { deleteOrder, getOrders } from "../Api/apiOrders.js";
import DashboardMenu from "../components/dashboardMenu.js";
import { hideLoading, rerender, showLoading, showMessage } from "../utils.js";

const OrderListScreen = {
    after_render: () => {
        const editButtons = document.getElementsByClassName('edit-btn');
        Array.from(editButtons).forEach((editBtn) => {
            editBtn.addEventListener('click', () => {
                document.location.hash = `/order/${editBtn.id}`;
            });
        });
        const deleteButtons = document.getElementsByClassName('delete-btn');
        Array.from(deleteButtons).forEach((deleteBtn) => {
            deleteBtn.addEventListener('click', async () => {
                if(confirm('Are you sure you want to delete this order?')) {
                    showLoading();
                    const data = await deleteOrder(deleteBtn.id);
                    if(data.error) {
                        showMessage(data.error);
                    }else {
                        rerender(OrderListScreen);
                    }
                    hideLoading();
                }
            });
        })
    },
    render: async () => {
        const orders = await getOrders();
        return `
        <div class="dashboard content" id="order-container">
            ${DashboardMenu.render({selected: 'orders'})}
            <div class="dashboard-content">
                <div class="dp-list-header">    
                    <h1>Order List</h1>
                </div>
                <div class="table-small-screen">
                    <p>Screen width is too small. Please flip your mobile device over to view table.<p>
                </div>
                <div class="order-list list">
                    <table>
                        <thead> 
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>USER</th>
                                <th>PAID AT</th>
                                <th>DELIVERED AT</th>
                                <th class="tr-action">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.map(order => `
                            <tr>
                                <td>${order._id}</td>
                                <td>${order.createdAt}</td>
                                <td>${order.totalPrice}</td>
                                <td>${order.user.name}</td>
                                <td>${order.paidAt || 'No'}</td>
                                <td>${order.deliveredAt || 'No'}</td>
                                <td>
                                    <button id="${order._id}" class="edit-btn">Edit</button>
                                    <button id="${order._id}" class="delete-btn">Delete</button>
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

export default OrderListScreen;