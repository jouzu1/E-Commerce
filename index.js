const express = require('express');
const app = express();                          //Untuk menjalankan server backend

const mongoose = require('mongoose');           //Untuk menyambungkan app ke DB Cloud Atlas Mongo

const connString = require('./secret_connect'); //Secret Connection String to DB, dont share this string!!


app.listen(5000,()=>{
    console.log('Backend server sedang berjalan')
});

mongoose.connect(connString.connectionString).then(()=>{
    console.log("Koneksi ke DB Berhasil")
}).catch((err)=>{
    console.log(err);
});

