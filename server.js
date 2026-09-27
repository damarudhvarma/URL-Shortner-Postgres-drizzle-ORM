import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
dotenv.config();


const app = express();

const port = process.env.PORT ?? "3000";
app.use(express.json());
app.use('/users', userRouter);

app.listen(port,()=>{
    console.log(`server running at ${port}`);
})


