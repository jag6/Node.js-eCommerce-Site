import { createBanner, deleteBanner, getBanners } from "../Api/apiBanners.js";
import DashboardMenu from "../components/dashboardMenu.js";
import { hideLoading, rerender, showLoading, showMessage } from "../utils.js";

const BannerListScreen = {
    after_render: () => {
        document.getElementById("create-banner-btn").addEventListener('click', async () => {
            const data = await createBanner();
            document.location.hash = `/banner/${data.banner._id}/edit`;
        });
        const editButtons = document.getElementsByClassName('edit-btn');
        Array.from(editButtons).forEach((editBtn) => {
            editBtn.addEventListener('click', () => {
                document.location.hash = `/banner/${editBtn.id}/edit`;
            });
        });
        const deleteButtons = document.getElementsByClassName('delete-btn');
        Array.from(deleteButtons).forEach((deleteBtn) => {
            deleteBtn.addEventListener('click', async () => {
                if(confirm('Are you sure you want to delete this banner?')) {
                    showLoading();
                    const data = await deleteBanner(deleteBtn.id);
                    if(data.error) {
                        showMessage(data.error);
                    }else {
                        rerender(BannerListScreen);
                    }
                    hideLoading();
                }
            });
        })
    },
    render: async () => {
        const banners = await getBanners();
        return `
        <div class="dashboard content">
            ${DashboardMenu.render({selected: 'banners'})}
            <div class="dashboard-content">
                <div class="dp-list-header">    
                    <h1>Banner List</h1>
                    <div class="cpb"><button id="create-banner-btn" class="primary bold">Create Banner</button></div>
                </div>
                <div class="banner-list list">
                    <table>
                        <thead> 
                            <tr>
                                <th>TITLE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${banners.map(banner => `
                            <tr>
                                <td>${banner.title}</td>
                                <td>
                                    <button id="${banner._id}" class="edit-btn">Edit</button>
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

export default BannerListScreen;