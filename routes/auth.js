const router = require('express').Router();
const User = require('../Models/user');
// const bcrypt = require('bcryptjs');                                     //Memanggil cryptojs untuk meng-encrypt password ke DB
const dotenv = require('dotenv');                                       //Memanggil library dotenv agar bisa memanggil .env file
var CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');


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
        // !userLogin && res.status(401).send("User not exist!");                  //Cara lain dari kondisi IF
        if(!userLogin){
            return res.status(401).send("User not exist!");                        //Memberikan 'return'setiap membuat kondisi
        }
        
        const decryptPassword = CryptoJS.AES.decrypt(userLogin.password,process.env.PASSWORD).toString(CryptoJS.enc.Utf8);
        // decryptPassword !== req.body.password &&                                //Cara lain dari kondisi IF
        //     res.status(401).send("Wrong credential!")
        // res.status(201).send(userLogin);
        const accessToken = jwt.sign({                                             //Membuat object/membuat semacam tanda JWT dengan membuat obejct baru sehingga object accessToken akan dijadikan sebagai respond di postman. Hasil respond akan menghasilkan dua object 
            id:userLogin._id,
            isAdmin:userLogin.isAdmin
        },process.env.JWT, {expiresIn:"3d"})
        if(decryptPassword !== req.body.password){
            return res.status(401).send("Wrong credential!")                       //Memberikan 'return' pada saat membuat kondisi
        }else{
            const {password, ...others} = userLogin._doc;
            return res.status(201).send({others,accessToken});                    //Menghasilkan dua object
        }
    } catch(err) {
         res.status(500).send(err);
    }
})


module.exports = router