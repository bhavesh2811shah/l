import mongoose from "mongoose";

//create schema

const userSchema = new mongoose.Schema(
  {
    //create object those i have to required  for our registration page 
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  password:{
    type: String,
    required: true,
  },
  //
  confirmpassword:{
    type: String,
    required: true,
  },

    phone: {
      type:String,
     required: true,
     unique: true,
    },
    address: {
      type: {},
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
//now creating routes for register
