const express = require('express');
const app = express();                              //Untuk menjalankan server backend

const mongoose = require('mongoose');               //Untuk menyambungkan app ke DB Cloud Atlas Mongo

// const connString = require('./secret_connect'); //Secret Connection String to DB, dont share this string!!

const dotenv = require('dotenv');                   //Ini juga sama, memanggil secret key dari file .env

//Imported route service
const userRoute = require('./routes/user.js');      //Memanggil service/endpoint /usertest ke main file ini yaitu index.js
const authRoute = require('./routes/auth.js');      //Memanggil service auth
const productRoute = require('./routes/product');   //Memanggil service product

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

app.use(express.json());                            //Line code ini berfungsi untuk menambahkan body parser untuk METHOD POST, UPDATE dan bisa juga DELETE
app.use(authRoute);                                 //Memanggil service registrasi untuk menambahkan model user ke MongoDB
app.use("/user",userRoute)                          //Memanggil service dengan HTTP GET/POST/UPDATE/DELETE *localhost:5000/api/usertest 
app.use("/product",productRoute)                    //Memanggil service route dari product


