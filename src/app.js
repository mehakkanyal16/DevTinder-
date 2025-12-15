const express = require("express");
const app = express();
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();
app.use(express.json());
app.use(cookieParser());

const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const {userAuth} = require("./middlewares/auth");



const PORT = process.env.PORT || 5000;



// app.use('/',(req,res)=>{
//   res.send("Hello World");
// })

app.get("/profile",userAuth, async(req, res) => {
   try {
    // const { token } = req.cookies;

  
    const user=req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  } 

});


 app.post("/signup", async (req, res) => {
   
  try {
    //validations
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    //Encrptying password

    const passwordHash = await bcrypt.hash(password, 10);
    console.log("hashed password :", passwordHash);

    //Creating user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    newUser.save().then((user) => {
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    });
  } catch (err) {
    console.error("Error in /signup route:", err);
    res.status(500).json({ message: "Validation Failed", error: err.message });
  }
});

app.post("/login", async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {

      //create jwt token
      // const token = jwt.sign({ _id: user._id },process.env.JWT_SECRET, {
      //   expiresIn: "1h",
      // }); 
     
      const token = user.getJWT();
      

      // Add the token to cookie and send the response back to user
      res.cookie("token", token,{
        expires: new Date(Date.now() + 8 * 3600000), // 8 hours
      });
      console.log(token);

      res.status(200).json({
        success: true,
        message: "Login successful",
        // data:user,
      });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    console.error("Error in /login route:", err);
    res
      .status(401)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

// app.delete("/user", async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const deletedUser = await User.findByIdAndDelete(userId);
//     if (!deletedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({
//       success: true,
//       message: "User deleted successfully",
//       data: deletedUser,
//     });
//   } catch (err) {
//     console.error("Error in /user DELETE route:", err);
//     res
//       .status(500)
//       .json({ message: "Internal Server Error", error: err.message });
//   }
// });

// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;

//   try {
//     const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed");
//     }
//     if (data?.skills.length > 10) {
//       throw new Error("Skills cannot be more than 10");
//     }

//     const user = await User.findByIdAndUpdate(userId, data, {
//       new: true,
//       runValidators: true,
//     });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: user,
//     });
//   } catch (err) {
//     console.error("Error in /user PATCH route:", err);
//     res
//       .status(500)
//       .json({ message: "Internal Server Error", error: err.message });
//   }
// });

app.post("/sendConnectionRequest",userAuth ,async(req,res)=>{
  try{

    console.log("sending connection request");
    res.send("Connection request sent");
  }catch(err){
    console.error("Error in /sendConnectionRequest route:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
