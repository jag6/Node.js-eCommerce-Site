import { getMyOrders } from "../Api/apiOrders.js";
import { showMessage } from "../utils.js";
import { getUserInfo, setUserInfo, clearUser } from "../localStorage.js";
import { update } from "../Api/apiUsers.js";

const ProfileScreen = {
    after_render: () => {
        document.getElementById("signout-btn").addEventListener('click', () => {
            clearUser();
            document.location.hash = '/';
        })
        document.getElementById("profile-form").addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = await update({
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            });
            if (data.error) {
                showMessage(data.error);
            }else {
                setUserInfo(data);
                showMessage('User Info Updated', () => {
                    document.location.hash = '/';
                });
            }
        });
    },
    render: async () => {
        const {name, email} = getUserInfo();
        if (!name) {
            document.location.hash = '/';
        }
        const orders = await getMyOrders();
        return `
        <div class="profile content">
            <div class="profile-info">
                <div class="form-container">
                    <form id="profile-form" class="form">
                        <h1>User Profile</h1>
                        <label for="name">Name</label>
                        <input type="text" name="name" id="name" value="${name}">
                        <label for="email">Email</label>
                        <input type="email" name="email" id="email" value="${email}">
                        <label for="password">Password</label>
                        <input type="password" name="password" id="password">    
                        <button type="submit" class="primary">Update</button>   
                        <button type="button" id="signout-btn">Sign Out</button>    
                    </form>
                </div>
            </div>
            <div class="profile-orders">
                <h2>Order History</h2>
                <div class="table-small-screen">
                    <p>Screen width is too small. Please flip your mobile device over to view table.<p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ORDER ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.length === 0 ? `<tr><td colspan="6">No Order Found</tr>`:
                    orders.map(order => `
                    <tr>
                        <td>${order._id}</td>
                        <td>${order.createdAt}</td>
                        <td>${order.totalPrice}</td>
                        <td>${order.paidAt || 'No'}</td>
                        <td>${order.deliveredAt || 'No'}</td>
                        <td><a href="/#/order/${order._id}">DETAILS</a></td>
                    </tr>
                    `).join('\n')
                    }
                    </tbody>
                </table>
            </div>
        </div>
        
        `;
    }
};

export default ProfileScreen;