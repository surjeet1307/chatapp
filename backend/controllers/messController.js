const asyncHandler=require('express-async-handler');
const Message = require('../Models/messagemodel');
const User = require('../Models/userModel');
const Chat = require('../Models/chatModel');


const sendMessage=asyncHandler(async(req,res)=>{
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
    let newMess={
        sender:req.user._id,
        content:content,
        chat:chatId
    }

    try {
        let mess=await Message.create(newMess)
        mess = await mess.populate("sender", "name pic");
        mess = await mess.populate("chat");
        mess = await User.populate(mess, {
          path: "chat.users",
          select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: mess });
        res.json(mess)
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

})


const getMessage=asyncHandler(async(req,res)=>{
try {
    let allMes=await Message.find({chat:req.params.chatId}).populate('sender','name email pic').
    populate('chat')
    res.json(allMes)
} catch (error) {
    res.status(400);
    throw new Error(error.message);
}
})


module.exports={sendMessage,getMessage}