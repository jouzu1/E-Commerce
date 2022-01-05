/**
 * Catatan yang ada di Models/user.js akan berlaku implementasinya di semua file di bawah folder Models
 */

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId : { type:String, required:true},
    products : [
        {
            productId : {type:mongoose.Schema.Types.ObjectId, default : mongoose.Types.ObjectId, index:{ unique: true }},
            quantity : {type:Number,default:1},
        }
    ],
    amount : {type:Number, required:true},
    address : {type:Object, required:true},
    status : {type:String,default:"Pending"}    
},{timestamps:true})

module.exports = mongoose.model("Order",OrderSchema);