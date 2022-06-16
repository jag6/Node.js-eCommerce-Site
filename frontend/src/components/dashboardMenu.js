const DashboardMenu = {
    render: (props) => {
        return `
        <div class="dashboard-menu">
            <ul>
                <li class="${props.selected === 'dashboard' ? 'selected' : ''}">
                    <a href="/#/dashboard">Overview</a>
                </li> 
                <li class="${props.selected === 'users' ? 'selected' : ''}">
                    <a href="/#/userlist">Users</a>
                </li> 
                <li class="${props.selected === 'orders' ? 'selected' : ''}">
                    <a href="/#/orderlist">Orders</a>
                </li> 
                <li class="${props.selected === 'products' ? 'selected' : ''}">
                    <a href="/#/productlist">Products</a>
                </li> 
                <li class="${props.selected === 'banners' ? 'selected' : ''}">
                    <a href="/#/bannerlist">Banners</a>
                </li> 
            </ul>
        </div>
        `;
    }
};

export default DashboardMenu;