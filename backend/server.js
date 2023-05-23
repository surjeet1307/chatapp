const express=require('express');
const { chats } = require('./data');
const dot=require('dotenv')
dot.config();
const cors=require('cors');
const connectDB = require('./config/db');
const app=express();
const userRoutes=require('./routes/userRoutes')
const chatRoutes=require('./routes/chatRoutes')
const messageRoute=require('./routes/messageRoute')
const path=require('path')

connectDB();
app.use(cors());
app.use(express.json())
const port=process.env.PORT;

app.use("/api/user",userRoutes);
app.use("/api/chats",chatRoutes)
app.use('/api/message',messageRoute)

let __dirname1=path.resolve()
if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname1, "backend/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1,'backend', "frontend", "build", "index.html"))
  );
}
else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

const server=app.listen(port,console.log(`Connect to server ${port}`));

const io=require('socket.io')(server,{
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
})

io.on("connection",(socket)=>{
console.log("Connected to socket");
socket.on('setup',(userData)=>{
socket.join(userData._id)
// console.log((userData._id));
socket.emit('connected')
})

socket.on('join chat',(room)=>{
socket.join(room)
console.log(room);
})



socket.on('new message',(newMess)=>{
let chat=newMess.chat
if(!chat.users) return console.log("chat.users not defined");
chat.users.forEach(ele => {
    if(ele._id == newMess.sender._id) return;
    socket.in(ele._id).emit('message recieved',newMess)
});
})

})