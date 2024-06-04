import express,{Request,Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from "./routes/users";

mongoose.connect(process.env.mongo_db_connection_string as string);
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.use("/api/users", userRoutes);


// app.get("/api/test",async(req: Request, res: Response)=>{
//  res.json({message: "hello from express endpoint!"});
// });
app.listen(7000, ()=>{
    console.log("server is running in localhost: 7000");
})