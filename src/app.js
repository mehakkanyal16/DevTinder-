const express=require('express');
const app=express();
const connectDB=require('./config/db');
const dotenv=require('dotenv');
dotenv.config();
const PORT=process.env.PORT || 5000;



app.use(express.json());


app.use('/',(req,res)=>{
  res.send("Hello World");
})
connectDB().then(()=>{
  console.log("Database connected successfully");
  app.listen(PORT,()=>{
console.log(`Server is running on port ${PORT}`);
});
}).catch((err)=>{
  console.error("Database connection failed", err);
});


