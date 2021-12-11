const mongoose = require('mongoose');                       //Line code ini diperlukan agar object bisa tersimpen ke MongoDB

const UserSchema = new mongoose.Schema({                    
    username:{type:String, required:true, unique:true},     
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    isAdmin:{type: Boolean, default:false},                  
},{timestamps:true});

module.exports = mongoose.model("User",UserSchema); //Di line code ini, object UserSchema akan kita ekspor keluar dari file ini sebagai "User"

//Object bernama UserSchema dengan propsnya yaitu username,email,password, isAdmin memiliki sub-props dengan isi tipe data, unique, required, dan default

//required:true, jika false, apabila saat body username atau passnya tidak ada, atau isi sub propsnya typenya : false, maka saat hit service post, akan terjadi error

//default false artinya, jika isi body tidak kita tulis isAdmin, maka di DB akan ditulis isAdmin = false secara default, apabila kita isi, maka nilai default false tidak akan tampil