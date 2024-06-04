import express,{Request,Response} from "express";
import {check,validationResult} from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// user login 
const router = express.Router();

router.post("/login",[
    check("email","Email is required").isEmail(),
    check("password","password with 6 or more characters required").isLength({
        min:6,
    }),
], async (req:Request, res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message: errors.array()});
    }

    const {email,password} = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user){
            // this is for user checking in database but the response should not be in the exact problem to secure from hackers
            return res.status(400).json({message:"Invalid user credentials"});
         }
 const isMatch = await bcrypt.compare(password, user.password);
if(!isMatch){
    // thuis is for password checking
    // security purpose
    return res.status(400).json({message:"Invalid password credentials"});
}

const token = jwt.sign(
    {userId: user.id},
    process.env.JWT_SECRET_KEY as string,
{
    expiresIn: "1d",
}
);

res.cookie("auth_token",token,{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 86400000,
});
res.status(200).json({userId:user._id});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"something went wrong"});
    }
}
);
export default router;