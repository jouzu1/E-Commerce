const router = require('express').Router();
const User = require('../Models/user');
// const bcrypt = require('bcryptjs');                                     //Memanggil cryptojs untuk meng-encrypt password ke DB
const dotenv = require('dotenv');                                       //Memanggil library dotenv agar bisa memanggil .env file
var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');



//REGISTER USER
router.post("/register", async(req,res)=>{                              //Menggunakan method POST untuk menulis object ke body di postman
    req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.PASSWORD).toString();
    const newUser = new User(req.body);
    // const newUser = new User({
    //     username : req.body.username,
    //     email : req.body.email,
    //     password : CryptoJS.AES.encrypt(req.body.password,process.env.PASSWORD).toString(),            //Line ini digunakan utk meng-encrypt password, memanggil file .env serta menampilkan password kedalam response json dalam bentuk string
    // })
    // const newUser = new User(req.body);                              //Bisa menggunakan cara dari line code ini untuk menyimpan object baru ke MongoDB dengan mengambil object body dari postman/Testing Tool API
    try{
        const SaveUser = await newUser.save();                          //Variabel dengan memakai method save() node js untuk menyimpan object newUser ke MongoDB
        // res.send(200, SaveUser);   
        // console.log(SaveUser);                                   
        res.status(201).send(SaveUser);                                 //res.send dipakai untuk memberikan response berupa hasil object yang kita POST di postman
    }catch(err){
        // res.send(500,err);
        res.status(500).send(err);
    }
})

//LOGIN USER
router.post('/login', async (req,res)=>{
    try {
        const userLogin = await User.findOne({username:req.body.username});         //Menggunakan method findOne() untuk menemukan user berdasarkan obj prop yang kita masukkan ke body
        // !userLogin && res.status(401).send("User not exist!");                  //Cara lain dari kondisi IF
        if(!userLogin){
            return res.status(401).send("User not exist!");                        //Memberikan 'return'setiap membuat kondisi
        }
        
        const decryptPassword = CryptoJS.AES.decrypt(userLogin.password,process.env.PASSWORD).toString(CryptoJS.enc.Utf8);
        // decryptPassword !== req.body.password &&                                //Cara lain dari kondisi IF
        //     res.status(401).send("Wrong credential!")
        // res.status(201).send(userLogin);

        /**
         * jwt.sign({}) merupakan method untuk membuat payload JWT
         * Di dalam method tersebut, ada 2 load yaitu id user dan role user yaitu isAdmin  
         * Memakai JWT dan Cookies 
         */

        const accessToken = jwt.sign({                                             //Membuat object/membuat semacam tanda JWT dengan membuat obejct baru sehingga object accessToken akan dijadikan sebagai respond di postman. Hasil respond akan menghasilkan dua object 
            id:userLogin._id,
            isAdmin:userLogin.isAdmin
        },process.env.JWT, {expiresIn:"3d"})                                       //Membuat Token JWT dengan menggunakan secret key dari file .env dengan variabel JWT
        if(decryptPassword !== req.body.password){
            return res.status(401).send("Wrong credential!")                       //Memberikan 'return' pada saat membuat kondisi
                                                                                    //Dari logic sebelah kiri, ini cara authentikasi, mencari user dengan findOne(), mendapatkan field password yang di encrypt lalu di decrypt. Setelah itu, hasil password yang di decrypt akan dibandingkan password yang di body
        }else{
            const {password, ...newObject} = userLogin._doc;                        //Mengambil field password setelah itu sisa fieldnya menggunakan spread param/operator
            return res.cookie('cookie',accessToken,{maxAge:259200,httpOnly:true,secure:false}).status(201).send({...newObject,accessToken});                //Menghasilkan dua object + store JWT in cookies
        }                      //'cookie' adalah nama keynya, sedangkan accessToken adalah valuennya
    } catch(err) {
         res.status(500).send(err);
    }
})


module.exports = router