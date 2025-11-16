const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
      return  mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true 
         });
       
    
};
module.exports = connectDB;
