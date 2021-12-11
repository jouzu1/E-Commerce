const router = require('express').Router();
const User = require('../Models/user')

//REGISTER USER
router.post("/register", async(req,res)=>{                              //Menggunakan method POST untuk menulis object ke body di postman
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
    })
    try{
        const SaveUser = await newUser.save();                          //Variabel dengan memakai method save() node js untuk menyimpan object newUser ke MongoDB
        res.send(200,"User Teregistrasi " + newUser).json(SaveUser);    //res.send dipakai untuk memberikan response berupa hasil object yang kita POST di postman
    }catch(err){
        res.send(500,"Username, email, dan password harus terisi").json(err);
    }
})


module.exports = router