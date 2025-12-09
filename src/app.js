const express=require('express');
const app=express();
const connectDB=require('./config/db');
const dotenv=require('dotenv');
const User=require('./models/user');
dotenv.config();

const PORT=process.env.PORT || 5000;

app.use(express.json());


// app.use('/',(req,res)=>{
//   res.send("Hello World");
// })
app.post('/user',(req,res)=>{
  try{
    const {firstName,lastName,email,password,age,gender}=req.body;
    const newUser=new User({firstName,
    lastName,
    email,
    password,
    age,
    gender}); 
    newUser.save().then((user)=>{
      res.status(201).json({
        success:true,
        message:"User created successfully",
        data:user,
      });
    })
  }catch(err){
    console.error("Error in /test route:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });

  }
  
   
});

app.delete('/user',async(req,res)=>{
  try{
    const {userId}=req.body;
    const deletedUser=await User.findByIdAndDelete(userId);
      if(!deletedUser){
        return res.status(404).json({message:"User not found"})
        }
        res.status(200).json({
          success:true,
          message:"User deleted successfully",
          data:deletedUser,
        });
  }
  catch(err){
    console.error("Error in /user DELETE route:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

app.patch('/user/:userId',async(req,res)=>{
  const userId=req.params?.userId;
  const data=req.body;
  

  try{
     const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user =await User.findByIdAndUpdate(userId,data,{
      new:true,
      runValidators:true
    });
    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    res.status(200).json({
      success:true,
      message:"User updated successfully",
      data:user,
    });
  }catch(err){
    console.error("Error in /user PATCH route:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });

  }

}
);

connectDB().then(()=>{  
  console.log("Database connected successfully");
  app.listen(PORT,()=>{
console.log(`Server is running on port ${PORT}`);
});
}).catch((err)=>{
  console.error("Database connection failed", err);
});


