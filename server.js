require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const user = require('./routers/user.router')
const category = require('./routers/categories.router');
const upload = require('./routers/upload.router');
const product = require('./routers/product.route')
const checkout = require('./routers/checkout.route')
const payment = require('./routers/payment.route')
const discount = require('./routers/discounts.route');
const comment = require('./routers/comments.route');

const Comments = require('./models/comments.model')

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
let users = [];
io.on("connection", (socket) => {
    console.log(socket.id + 'connected')
    socket.on("joinRoom", id => {
        const user = { idRoom: socket.id, room: id }
        const check = users.every(user => user.idRoom !== socket.id)
        if (check) {
            users.push(user)
            socket.join(user.room);
        }
        else {
            users.map(user => {
                if (user.idRoom === socket.id) {
                    if (user.room !== id) {
                        socket.leave(user.room)
                        socket.join(id);
                        user.room = id;
                    }
                }
            })
        }
        // console.log(users)
        // console.log(socket.adapter.rooms);
    })
    socket.on('test', (data) => {
        //console.log(data);
    })
    socket.on("client-sent-data", (data) => {
        // console.log(data, 'x1');
        io.sockets.emit("server-sent-data", data.msg);
    })
    socket.on("add-product", (data) => {
        //console.log(data, 'x2');
        io.sockets.emit("add-product", data);
    })
    socket.on("deleteDiscount", (data) => {
        //console.log(data, 'x3');
        io.sockets.emit("deleteDiscount", data);
    })
    socket.on("createcomment", async (data) => {
        //console.log(data);
        const { user_id, content, product_id, createAt, username, rating } = data;
        const newComment = new Comments({
            user_id, content, product_id, createAt, username, rating
        })
        await newComment.save();

        io.to(newComment.product_id).emit("sendComment", newComment)
    })
    socket.on("replycomment", async (data) => {
        const { user_id, myname, content, createAt, yourname, id } = data
        const newReply = { user_id, myname, content, createAt, yourname, id }
        const comment = await Comments.findById({ _id: id })
        if (comment) {
            comment.reply.push({ id, user_id, myname, content, createAt, yourname, reply: [] })
            await comment.save();
            io.to(comment.product_id).emit('replyComment', newReply)
        }
    })
    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnect');
    })
});

app.use(express.json());
app.use(cookieParser());
app.use(cors());
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(fileUpload({
    useTempFiles: true
}));
//Routes
app.use('/user', user);
app.use('/category', category);
app.use('/images', upload);
app.use('/products', product);
app.use('/checkout', checkout);
app.use('/payment', payment);
app.use('/discounts', discount);
app.use('/comments', comment);




//connect to mongoDB
mongoose
    .connect(process.env.URL_MONGODB, {
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.error(`Connection failed...`)
    );

app.get('/', (req, res) => {
    res.json('test');
})


const PORT = process.env.PORT || 8000
http.listen(PORT, () => {
    console.log('server is running on port', PORT);
})