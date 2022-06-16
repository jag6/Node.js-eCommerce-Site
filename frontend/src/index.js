import HomeScreen from "./Screens/HomeScreen.js";
import SearchScreen from "./Screens/SearchScreen.js";
import ProductScreen from "./Screens/ProductScreen.js";
import { parseRequestUrl } from "./utils.js";
import Error404Screen from "./Screens/Error404Screen.js";
import CartScreen from "./Screens/CartScreen.js";
import SignInScreen from "./Screens/SignInScreen.js";
import Header from "./components/header.js";
import Sidebar from "./components/sidebar.js";
import RegisterScreen from "./Screens/RegisterScreen.js";
import ProfileScreen from "./Screens/ProfileScreen.js";
import ShippingScreen from "./Screens/ShippingScreen.js";
import PaymentScreen from "./Screens/PaymentScreen.js";
import PlaceOrderScreen from "./Screens/PlaceOrderScreen.js";
import OrderScreen from "./Screens/OrderScreen.js";
import DashboardScreen from "./Screens/DashboardScreen.js";
/*import SupportScreen from "./Screens/SupportScreen.js";*/
import UserListScreen from "./Screens/UserListScreen.js";
import ProductListScreen from "./Screens/ProductListScreen.js";
import ProductEditScreen from "./Screens/ProductEditScreen.js";
import OrderListScreen from "./Screens/OrderListScreen.js";
import BannerListScreen from "./Screens/BannerListScreen.js";
import BannerEditScreen from "./Screens/BannerEditScreen.js";
import Chatbox from "./components/chatBox.js";


const routes = {
    '/': HomeScreen,
    '/search': SearchScreen,
    '/product/:id/edit': ProductEditScreen,
    '/product/:id': ProductScreen,
    '/order/:id': OrderScreen,
    '/cart/:id': CartScreen,
    '/cart': CartScreen,
    '/signin': SignInScreen,
    '/register': RegisterScreen,
    '/profile': ProfileScreen,
    '/shipping': ShippingScreen,
    '/payment': PaymentScreen,
    '/placeorder': PlaceOrderScreen,
    '/dashboard': DashboardScreen,
    /*'/support': SupportScreen,*/
    '/userlist': UserListScreen,
    '/productlist': ProductListScreen,
    '/orderlist': OrderListScreen,
    '/bannerlist': BannerListScreen,
    '/banner/:id/edit': BannerEditScreen
};

const router = async() => {
    const request = parseRequestUrl();
    const parseUrl = 
        (request.resource ? `/${request.resource}`: '/') +
        (request.id ? '/:id': '') + 
        (request.verb ? `/${request.verb}` : '');
    const screen = routes[parseUrl] ? routes[parseUrl]: Error404Screen;
    
    const header = document.getElementById("header-container");
    header.innerHTML = await Header.render();
    await Header.after_render();
    
    const sidebar = document.getElementById("sidebar-container");
    sidebar.innerHTML = await Sidebar.render();
    await Sidebar.after_render();

    const chatBox = document.getElementById("chatbox");
    chatBox.innerHTML = await Chatbox.render();
    await Chatbox.after_render();
    
    const main = document.getElementById("main-container");
    main.innerHTML = await screen.render();
    if(screen.after_render) await screen.after_render();
};

window.addEventListener('load', router);
window.addEventListener('hashchange', router);