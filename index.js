const express = require('express');
const app = express();                              //Untuk menjalankan server backend
const cookieParser = require('cookie-parser')

const mongoose = require('mongoose');               //Untuk menyambungkan app ke DB Cloud Atlas Mongo

// const connString = require('./secret_connect'); //Secret Connection String to DB, dont share this string!!

const dotenv = require('dotenv');                   //Ini juga sama, memanggil secret key dari file .env

//Imported route service
const userRoute = require('./routes/user.js');      //Memanggil service/endpoint /usertest ke main file ini yaitu index.js
const authRoute = require('./routes/auth.js');      //Memanggil service auth
const productRoute = require('./routes/product');   //Memanggil service product
const orderRoute = require('./routes/order');   //Memanggil service order
const cartRoute = require('./routes/cart');   //Memanggil service cart
const stripe = require('./routes/stripe'); //
const { default: axios } = require('axios');

const router = require('express').Router();

dotenv.config();                                    //Line ini untuk bisa menggunakan/memanggil file .env dengan cara process.env.*namaVariabelnya*


app.listen(process.env.PORT || 5000,()=>{           //Menambahkan kondisi jika nilai port tidak ada, bisa menggunakan default
    if(process.env.PORT == null){
        console.log('Backend server sedang berjalan di port ' + 5000)
    }else{
        console.log('Backend server sedang berjalan di port ' + process.env.PORT)
    }
    
});

mongoose.connect(process.env.MONGO_URL).then(()=>{  //Menyambungkan app ini ke MongoDB cloud
    console.log("Koneksi ke DB Berhasil")
}).catch((err)=>{
    console.log(err);
});
/**
 * Middleware (app.use())
*/
app.use(cookieParser())                             //Menggunakan cookies agar dapat memparsing cookies
app.use(express.json());                            //Line code ini berfungsi untuk menambahkan body parser untuk METHOD POST, UPDATE dan bisa juga DELETE
app.use(authRoute);                                 //Memanggil service registrasi untuk menambahkan model user ke MongoDB
app.use("/user",userRoute)                          //Memanggil service dengan HTTP GET/POST/UPDATE/DELETE *localhost:5000/api/usertest 
app.use("/product",productRoute)                    //Memanggil service route dari product
app.use("/order",orderRoute)                        //Memanggil service route dari order
app.use("/cart",cartRoute)                          //Memanggil service route dari cart
app.use("/stripe",stripe)

app.use(router.get("/test",(req,res)=>{
    res.status(200).send("Hai Laila")
}))

/**
 * My Mojo API Project
 */

app.use(router.get("/mymojo",(req,res)=>{
         axios.get(
             "https://app.mojohelpdesk.com/api/v2/tickets/search?query=assignee.id:3990568&access_key=80a28e5d9a96398cc7d1da02691118d3afaa84bf&per_page=100&sort_order=desc"
             )
         .then(x=>{
             res.status(200).send(x.data);
             //logic expression here
    }).catch(err=>{
        res.status(400).send(err);
    })
}))

//Mengekspor file index.js agar bisa digunakan sebagai testing API di file test
module.exports = app;
