import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type:String,
        require:true,
        unique:true
    },
    description: {
        type:String,
        require:true
    },
    website: {
        type:String,
  
    }, location: {
        type:String,
        require:true
    },
    logo:{
        type:String, //URL
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    }
}, {timestamps:true})
export const Company = mongoose.model('Company',companySchema)