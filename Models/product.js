/**
 * Catatan yang ada di Models/user.js akan berlaku implementasinya di semua file di bawah folder Models
 */

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title : {type:String, required:true, unique:true},
    desc : {type:String, required:true},
    img : {type:String, required:true},
    categories : {type:Array},
    size : {type:String},
    color : {type:String},
    price : {type:Number, required:true}
}, {timestamps:true})

module.exports = mongoose.model("Product",ProductSchema);