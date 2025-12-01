const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    firstName: { 
        type: String,
        required: true,
     },
    lastName:{
        type:String,

    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
     },
    password: { 
        type: String, 
        required: true 
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","other"].includes(value.toLowerCase())){
                throw new Error("Gender data is not valid");;   
            }
        }

    },
    photoUrl:{
        type:String,
        default:" https://www.clipartmax.com/middle/m2i8d3i8N4d3N4K9_flat-person-icon-download-dummy-man/ "
    },
    about:{
        type:String,
        default:"This is a default about of a user."
    },
    skills:{
        type:[String],
    }

} ,{ timestamps: true });
module.exports = mongoose.model('User', userSchema);
