import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"



export const sendMessage=async(req,res)=>{
   try {
    const {message}=req.body
    const {id:reciiverId}=req.params
    const senderId=req.user._id

    let conversation=await Conversation.findOne({
        participants:{$all:[senderId,reciiverId]}
    })

    if (!conversation) {
        conversation=await Conversation.create({
            participants:[senderId,reciiverId],
        });
    }

    const newMessage=new Message({
        senderId,
        reciiverId,
        message
    })

    if(newMessage){
        conversation.messages.push(newMessage._id);
    } 

    res.status(201).json({message:"Message sent -->"})

    //SOCKET IO will be here soon

    // await conversation.save();
    // await newMessage.save();     
    
    await Promise.all([conversation.save(),newMessage.save()]);

   } catch (error) {
    console.log("Error in sending Message ",error.message)
    res.status(500).json({error:"Internal Server Error"})
   }
}

export const getMessage=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const cleanId=userToChatId.trim();      
        const senderId=req.user._id

        const conversation=await Conversation.findOne({
            participants:{$all:[senderId,cleanId]},        
        }).populate("messages")

        if (!conversation) return res.status(200).json([]);

        const messages=conversation.message;

        res.status(201).json(conversation.messages)

    }catch (error) {
    console.log("Error in fetching Messages ",error.message)
    res.status(500).json({error:"Internal Server Error"})
   }
}

export default sendMessage;