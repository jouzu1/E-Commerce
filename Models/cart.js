/**
 * Catatan yang ada di Models/user.js akan berlaku implementasinya di semua file di bawah folder Models
 */

const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId : { type:String, required:true},
    products : [
        {
            productId : {type:String},
            quantity : {type:Number,default:1},
        }
    ]
},{timestamps:true})


module.exports = mongoose.model("Cart",CartSchema);

var x = 1;
x =2;