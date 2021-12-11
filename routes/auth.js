const router = require('express').Router();
const User = require('../Models/user');
const bcrypt = require('bcryptjs');                                     //Memanggil cryptojs untuk meng-encrypt password ke DB
const dotenv = require('dotenv');                                       //Memanggil library dotenv agar bisa memanggil .env file
var CryptoJS = require("crypto-js");


//REGISTER USER
router.post("/register", async(req,res)=>{                              //Menggunakan method POST untuk menulis object ke body di postman
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : CryptoJS.AES.encrypt(req.body.password,process.env.PASSWORD).toString(),            //Line ini digunakan utk meng-encrypt password, memanggil file .env serta menampilkan password kedalam response json dalam bentuk string
    })
    try{
        const SaveUser = await newUser.save();                          //Variabel dengan memakai method save() node js untuk menyimpan object newUser ke MongoDB
        // res.send(200, SaveUser);                                        
        res.status(200).send(SaveUser);                                 //res.send dipakai untuk memberikan response berupa hasil object yang kita POST di postman
    }catch(err){
        // res.send(500,err);
        res.status(500).send(err);
    }
})

//LOGIN USER
router.post('/login', async (req,res)=>{
    try {
        const userLogin = await User.findOne({username:req.body.username});

    } catch (error) {
        
    }
})


module.exports = router