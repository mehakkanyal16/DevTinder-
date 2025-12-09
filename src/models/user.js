const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
     validate(value){
        if(!validator.isEmail(value)){      
            throw new Error("Invalid Email Address: "+value);
        }   
     }
    },

    password: {
      type: String,
      required: true,
       validate(value){
        if(!validator.isStrongPassword(value)){      
            throw new Error("Password is not strong enough."+value);
        }   
     }
      
    },

    age: {
      type: Number,
      min: 18,
    },

    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },

    photoUrl: {
      type: String,
      default:
        "https://www.clipartmax.com/middle/m2i8d3i8N4d3N4K9_flat-person-icon-download-dummy-man/",
       validate(value){
        if(!validator.isURL(value)){      
            throw new Error("Invalid Photo URL: "+value);
        }   
     }
    },

    about: {
      type: String,
      default: "This is a default about of a user.",
      trim: true,
    },

    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
