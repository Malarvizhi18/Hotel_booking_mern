import express,{Request, Response} from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import {check, validationResult} from "express-validator"
const router = express.Router();

//  /api/users/register
router.post("/register",[
    check("firstname","First name is required!!..").isString(),
    check("lastname","Last name is required!!..").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required..").isLength({min:6})
]
,async (req: Request, res: Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // return error to client
        return res.status(400).json({message: errors.array()});
    }
    try {
    let user = await User.findOne({
        email: req.body.email,
    });
    if(user){
        return res.status(400).json({message: "User already exist"});
    }
    user = new User(req.body);
    await user.save();

    const token = jwt.sign({userId: user.id},
        process.env.JWT_SECRET_KEY as string,
        {
            expiresIn: "1d",
            // expires in 1 day
        }
    );
res.cookie("auth_token", token,{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 86400000,
    // time limit in seconds 
})
return res.sendStatus(200);
 } catch (error) {
    console.log(error);
    res.status(500).send({message: "Something went wrong"});
 }
});
export default router;