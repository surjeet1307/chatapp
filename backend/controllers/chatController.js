let asyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");

let accessChat = asyncHandler(async (req, res) => {
  let { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    isGroupchat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      let chatCrea = await Chat.create(chatData);
      let fullChat = await Chat.findOne({ _id: chatCrea._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});


let fetchChat=asyncHandler(async(req,res)=>{
    Chat.find({users:{$elemMatch:{$eq:req.user._id}}}).populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage").
    sort({updateAt:-1}).
    then(async(result)=>{
        result=await User.populate(result,{
            path: "latestMessage.sender",
          select: "name pic email",
        })
       res.status(200).send(result)

    })
})

const createGroup=asyncHandler(async(req,res)=>{
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
      }

       let users=JSON.parse(req.body.users)

       if(users.length<2){
            return res.status(400).send("Enter More than 2 users")
       }

       users.push(req.user)


       try {
        let creagroup=await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupchat:true,
            groupAdmin:req.user
        })

        let fullChat= await Chat.findOne({_id:creagroup._id}).populate('users','-password').
        populate('groupAdmin','-password')

        res.status(200).json(fullChat)

       } catch (error) {
        res.status(400);
        throw new Error(error.message);
       }

})

let renameGroup=asyncHandler(async(req,res)=>{
    let {chatId,chatName}=req.body
      
    let updatechat=await Chat.findByIdAndUpdate(chatId,{chatName:chatName},{
        new:true
    }).populate('users','-password').populate('groupAdmin','-password')

    if(!updatechat){
        res.status(404);
    throw new Error("Chat Not Found");
    }else{
        res.status(200).json(updatechat);
    }
})


let addToGroup=asyncHandler(async(req,res)=>{
    let {chatId,userId}=req.body;
    
    let useradd=await Chat.findByIdAndUpdate({_id:chatId},{
        $push:{users:userId}
    },{
        new:true
    }).populate("users","-password").populate("groupAdmin",'-password')

    if(!useradd){
        res.status(404);
    throw new Error("Chat Not Found");
    }else{
        res.json(useradd)
    }

})

let removeFromGroup=asyncHandler(async(req,res)=>{
    let {chatId,userId}=req.body;
    
    let userrem=await Chat.findByIdAndUpdate({_id:chatId},{
        $pull:{users:userId}
    },{
        new:true
    }).populate("users","-password").populate("groupAdmin",'-password')

    if(!userrem){
        res.status(404);
    throw new Error("Chat Not Found");
    }else{
        res.json(userrem)
    }

})


module.exports={accessChat,fetchChat,createGroup,renameGroup,addToGroup,removeFromGroup}
