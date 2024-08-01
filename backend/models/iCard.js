const mongoose = require('mongoose');

const iCardSchema=new mongoose({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    image:{
        type:String,
        required:true,
        trim:true,
    },
    branch:{
        type:String,
        required:true,
        trim:true,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    rollNo:{
        type:Number,
        required:true,
    }
})

const Card=mongoose.model('Card',iCardSchema)
module.exports=Card;