import User from "../models/usermodel.js";
import generateTokenandSetCookie from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const signup=async(req,res)=>{
    try{
        const {fullname,username,password,confirmPassword,gender}=req.body;

        if (password!==confirmPassword) {
            return res.status(404).json({error:"Passwords dont match"})
        }

        const user = await User.findOne({username});

        if (user) {
            return res.status(400).json({error:"Username already exists!"})
        }

        //Hashing passwords
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const boyProfilePic=`https://avatar.iran.liara.run/public/boy`
        const girlProfilePic=`https://avatar.iran.liara.run/public/girl`

        const newUser=new User({
            fullname,
            username,
            password:hashedPassword,
            gender,
            profilepic:gender==="male" ? boyProfilePic:girlProfilePic
        });
        if(newUser){
            await generateTokenandSetCookie(newUser._id,res);
            await newUser.save();
    
            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                username:newUser.username,
                profilepic:newUser.profilepic
            })

        }else{
            res.status(400).json({error:"Invalid user data"});
        }
    }catch(error){
        console.log("Error in signup controller",error.message)
        res.status(500).json({error:"Internal server error"})
    }
};

export const login=async(req,res)=>{
    try {
        const {username,password}=req.body;
        const user=await User.findOne({username});
        const isPasswordCorrect=await bcrypt.compare(password,user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error:"Incorrect login credentials"})
        }

        generateTokenandSetCookie(user._id,res);

        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            profilepic:user.profilepic,
        });
        
    }catch(error){
        console.log("Error in login controller",error.message)
        res.status(500).json({error:"Internal server error"})
    }
};

export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully..."})
    } catch (error) {
        console.log("Error in login controller",error.message)
        res.status(500).json({error:"Internal server error"})
    }
}