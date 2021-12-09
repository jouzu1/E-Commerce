const express = require('express');
const app = express();                          //Untuk menjalankan server backend

const mongoose = require('mongoose');           //Untuk menyambungkan app ke DB Cloud Atlas Mongo

const connString = require('./secret_connect'); //Secret Connection String to DB, dont share this string!!

const dotenv = require('dotenv');               //Ini juga sama, memanggil secret key dari file .env

dotenv.config();                                //Line ini untuk bisa menggunakan/memanggil file .env dengan cara process.env.*namaVariabelnya*


app.listen(process.env.PORT || 5000,()=>{       //Menambahkan kondisi jika nilai port tidak ada, bisa menggunakan default
    if(process.env.PORT == null){
        console.log('Backend server sedang berjalan di port ' + 5000)
    }else{
        console.log('Backend server sedang berjalan di port ' + process.env.PORT)
    }
    
});

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Koneksi ke DB Berhasil")
}).catch((err)=>{
    console.log(err);
});

app.get("/test/app",()=>{
    console.log("HTTP GET Berhasil di coba")
})

