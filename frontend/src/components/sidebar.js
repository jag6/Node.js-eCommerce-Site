const Sidebar = {
    render: async () => {
        return `
        <div class="sidebar-content">
            <div class="sidebar-header">
                <div class="brand">
                    <img src="Images/store.svg" alt="store">
                    <h1>i-Store</h1>  
                </div>
                <button class="sidebar-close-btn" id="sidebar-close-btn">x</button>
            </div>
            <div class="sidebar-body">
                <div><h2>SHOP BY CATEGORY</h2></div>  
                <ul class="categories" id="categories">
                    <li>
                        <a href="/#/search?q=shirt">Shirts
                            <span><i class="fa fa-chevron-right"></i></span>
                        </a>
                    </li>
                    <li>
                        <a href="/#/search?q=pants">Pants
                            <span><i class="fa fa-chevron-right"></i></span>
                        </a>
                    </li> 
                </ul>
            </div>
        </div>`;
    },
    after_render: async () => {
        document.getElementById("sidebar-close-btn").addEventListener('click', async () => {
            document.getElementById("sidebar-container").style.display = 'none';  
        });
        document.getElementById("categories").addEventListener('click', async () => {
            document.getElementById("sidebar-container").style.display = 'none';
        })
        window.addEventListener('click', (e) => {
            if(e.target == document.getElementById("sidebar-container")) {
                document.getElementById("sidebar-container").style.display = 'none';
            }
        })
    },
};

export default Sidebar;
    