import express from "express";
/*import SocketIO from "socket.io";
import http from "http";*/
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import config from "./config.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";
import productRouter from "./routers/productRouter.js";
import bannerRouter from "./routers/bannerRouter.js";
import searchRouter from "./routers/searchRouter.js";
import uploadRouter from "./routers/uploadRouter.js";
import path from "path";

mongoose.connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('connected to mongodb');
}).catch((error) => {
    console.log(error.reason);
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/banners', bannerRouter);
app.use('/api/search', searchRouter);

app.get('/api/paypal/clientId', (req, res) => {
    res.send({clientId: config.PAYPAL_CLIENT_ID});
});

app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
app.use(express.static(path.join(__dirname, '/../frontend')));
app.get('*', (req, res) => {
    res.sendFile(path.join(_dirname, '/..frontend/index.html'));
});

app.use((err, req, res, next) => {
    const status = err.name && err.name === 'ValidationError'? 400: 500;
    res.status(status).send({message: err.message});
});

/*const httpServer = http.Server(app);
const io = SocketIO(httpServer, {cors: {origin: '*'}});
const users = [];

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        const user = users.find((x) => x.socketId === socket.id);
        if(user) {
            user.online = false;
            console.log('Offline', user.name);
            const admin = users.find((x) => x.isAdmin && x.online);
            if(admin) {
                io.to(admin.socketId).emit('updateUser', user);
            }
        }
    });
    socket.on('onlogin', (user) => {
        const updatedUser = {
            ...user,
            online: true,
            socketId: socket.id,
            messages: [],
        };
        const existUser = users.find((x) => x._id === updatedUser._id);
        if(existUser) {
            existUser.socketId = socket.id;
            existUser.online = true;
        }else {
            users.push(updatedUser);
        }
        console.log('Online', user.name);
        const admin = users.find((x) => x.isAdmin && x.online);
        if(admin) {
            io.to(admin.socketId).emit('updateUser', updatedUser);
        }
        if(updatedUser.isAdmin) {
            io.to(updatedUser.socketId).emit('listUsers', users);
        }
    });
    socket.on('onUserSelected', (user) => {
        const admin = users.find((x) => x.isAdmin && x.online);
        if(admin) {
            const existUser = users.find((x) => x._id === user._id);
            io.to(admin.socketId).emit('selectUser', existUser);
        }
    });
    socket.on('onMessage', (message) => {
        if(message.isAdmin) {
            const user = users.find((x) => x._id === message._id && x.online);
            if(user) {
                io.to(user.socketId).emit('message', message);
                user.messages.push(message);
            }
        }else {
            const admin = users.find((x) => x.isAdmin && x.online);
            if(admin) {
                io.to(admin.socketId).emit('message', message);
                const user = users.find((x) => x._id === message._id && x.online);
                user.messages.push(message);
            }else {
                io.to(socket.Id).emit('message', {
                    name: 'Admin',
                    body: 'Sorry. I\'m not online right now. I\'ll try and respond as soon as possible. Thank you!'
                });
            }
        }
    })
});


httpServer.listen(5000, () => {
    console.log("serve at http://localhost:5000");
});*/
/*app.listen(5000, () => {
    console.log("serve at http://localhost:5000");
});*/

app.listen(config.PORT, () => {
    console.log("serve at http://localhost:5000");
});