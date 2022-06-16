import DashboardMenu from "../components/dashboardMenu.js";
import socketIOCLient from "socket.io-client";
import { getUsers } from "../Api/apiUsers.js";
import { getUserInfo } from "../localStorage.js";
import { apiUrl } from "../config.js";

let allUsers = [];
let allMessages = [];
let allSelectedUser = {};

/* source folder = npm i socket.io
   frontend = npm i socket.io-client */

const ENDPOINT = window.location.host.indexOf('localhost') >= 0
    ? apiUrl
    : window.location.host;

const SupportScreen = {
    after_render: () => {
        const [socket, setSocket] = (null);
        const [messages, setMessages] = [];
        const [users, setUsers] = [];
        const [selectedUser, setSelectedUser] = {};
        const [messageBody, setMessageBody] = '';
        if(document.getElementById("message-container")) {
            document.getElementById("message-container").scrollBy({
                    top: scrollHeight,
                    left: 0,
                    behavior: 'smooth'
                });
        }
        if(!socket) {
            const sk = socketIOCLient(ENDPOINT);
            setSocket(sk);
            sk.emit('onLogin', {
                _id: userInfo._id,
                name: userInfo.name,
                isAdmin: userInfo.isAdmin
            });
            sk.on('message', (data) => {
                if(allSelectedUser._id === data._id) {
                    allMessages = [...allMessages, data];
                }else {
                    const existUser = allUsers.find((user) => user._id === data._id);
                    if (existUser) {
                        allUsers = allUsers.map((user) => 
                            user._id === existUser._id 
                            ? {...user, unread: true}
                            : user 
                        );
                        setUsers(allUsers);
                    }
                }
                setMessages(allMessages);
            });
            sk.on('updateUser', (updatedUser) => {
                const existUser = allUsers.find((user) => user._id === updatedUser._id);
                if (existUser) {
                allUsers = allUsers.map((user) =>
                    user._id === existUser._id 
                    ? updatedUser 
                    : user
                );
                setUsers(allUsers);
                }else {
                    allUsers = [...allUsers, updatedUser];
                    setUsers(allUsers);
                }
            });
            sk.on('listUsers', (updatedUsers) => {
                allUsers = updatedUsers;
                setUsers(allUsers);
            });
            sk.on('selectUser', (user) => {
                allMessages = user.messages;
                setMessages(allMessages);
            });
        }[messages, socket, users];
        const selectUserButtons = document.getElementsByClassName('selectUser-btn');
        Array.from(selectUserButtons).forEach((selectUserBtn) => {
            selectUserBtn.addEventListener('click', (user) => {
                allSelectedUser = user;
                setSelectedUser(allSelectedUser);
                const existUser = allUsers.find((x) => x._id === user._id);
                if(existUser) {
                    allUsers = allUsers.map((x) => x._id === existUser._id
                    ? {...x, unread: false}
                    : x
                    );
                    setUsers(allUsers);
                }
                socket.emit('onUserSelected', user);
                });
        });
        document.getElementById("submit-handler").addEventListener('submit', async (e) => {
            e.preventDefault();
            if(!messageBody.trim()) {
                alert('Error. Please type message');
            }else {
                allMessages = [
                    ...allMessages,
                    {
                        body: messageBody,
                        name: userInfo.name
                    }];
                    setMessages(allMessages);
                    setMessageBody('');
                    setTimeout(() => {
                        socket.emit('onMessage', {
                            body: messageBody,
                            name: userInfo.name,
                            isAdmin: userInfo.isAdmin,
                            _id: selectedUser._id
                        });
                    }, 1000);
                }
        });
    },
    render: async () => {
        const users = await getUsers();
        if(users.error) {
            return(`<div>${users.error}</div>`)
        }
        const userInfo = getUserInfo();
        const selectedUser = [];
        const messages = [];
        return `
        <div class="dashboard content">
            ${DashboardMenu.render({selected: 'support'})}
            <div class="dashboard-content">
                <div class="dp-list-header">    
                    <h1>Customer Support</h1>
                </div>
            <div class="support-box">
                <div class="support-users">
                    ${users.filter((x) => x._id !== userInfo._id).length === 0
                        ? 'No Online User Found' 
                        : ''
                    }
                    <ul>
                        ${users.filter((x) => x._id !== userInfo._id).map((user) => (
                            `<li>
                                ${user._id === selectedUser._id ? 'selected' : ''}
                                <button type="button" class="selectUser-btn">${user.name}</button>
                                <span>${user.unread ? 'Unread' : user.online ? 'Online' : 'Offline'}</span>
                            </li>`
                        )).join('\n')}
                    </ul>
                </div>
                <div class="support-messages">
                    ${!selectedUser._id 
                        ? 'Select a user to start chatting!' 
                        :   `<div>
                                <div>
                                    <strong>Chat with ${selectedUser.name}</strong>
                                </div>
                                <ul id="message-container">
                                ${messages.length === 0 
                                    ? `<li>No Message</li>`
                                    : `${messages.map((message) => (
                                        `<li>
                                            <strong>{${message.name}: }</strong>${message.body}
                                        </li>`
                                    ))}`
                                }
                                </ul>
                                <div>
                                    <form id="submit-handler">
                                        <input value="${messageBody}" onchange="{(e) => messageBody(e.target.value)}" type="text" placeholder="Please type here">
                                        <button type="submit">SEND</button>
                                    </form>
                                </div>
                            </div>`
                    } 
                </div>
            </div>
        </div>
    `
    }
};

export default SupportScreen;