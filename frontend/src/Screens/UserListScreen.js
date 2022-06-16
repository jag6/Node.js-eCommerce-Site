import { deleteUser, getUsers } from "../Api/apiUsers.js";
import DashboardMenu from "../components/dashboardMenu.js";
import { hideLoading, rerender, showLoading, showMessage } from "../utils.js";

const UserListScreen = {
    after_render: () => {
        const deleteButtons = document.getElementsByClassName('delete-btn');
        Array.from(deleteButtons).forEach((deleteBtn) => {
            deleteBtn.addEventListener('click', async () => {
                if(confirm('Are you sure you want to delete this user?')) {
                    showLoading();
                    const data = await deleteUser(deleteBtn.id);
                    if(data.error) {
                        showMessage(data.error);
                    }else {
                        rerender(UserListScreen);
                    }
                    hideLoading();
                }
            });
        })
    },
    render: async () => {
        const users = await getUsers();
        return `
        <div class="dashboard content" id="user-container">
            ${DashboardMenu.render({selected: 'users'})}
            <div class="dashboard-content">
                <div class="dp-list-header">    
                    <h1>User List</h1>
                </div>
                <div class="table-small-screen">
                    <p>Screen width is too small. Please flip your mobile device over to view table.<p>
                </div>
                <div class="user-list list">
                    <table>
                        <thead> 
                            <tr>
                                <th>NAME</th>
                                <th>ADMIN</th>
                                <th>ID</th>
                                <th>EMAIL</th>
                                <th class="tr-action">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => ` 
                            <tr>
                                <td>${user.name}</td>
                                <td>${user.isAdmin}</td>
                                <td>${user._id}</td>
                                <td>${user.email}</td>
                                <td>
                                    <button id="${user._id}" class="delete-btn">Delete</button>
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

export default UserListScreen;