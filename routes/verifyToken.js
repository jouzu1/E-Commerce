/**
 * File ini digunakan untuk export token ke route user.js
 * Token didapatkan dari service login, lalu tokennya digunakan dalam service update
 */

const jwt = require('jsonwebtoken');

//Fungsi di bawah ditulis dalam bentuk ES6
const verifyToken = (req,res,next) => {                                 //Fungsi untuk verify Token
    const authHeader = req.headers.token;                               //Memasukkan key di header bernama 'token' lalu valuenya token yg kita dapat saat hit service login
    if(authHeader){
        const token = authHeader;

        /**
         * Pada saat membuat JWT dengan jwt.sign(), kita mengambil variabel JWT di file .env sebagai key di JWT
         * Lalu jwt.verify() ini gunanya membandingkan key dari JWT yang kita dapat dari service login 
         * lalu membandingkan key yang ada di file .env local dengan menggunakan variabel JWT di file .env
         */

        jwt.verify(token, process.env.JWT, (err,user)=>{                
            if(err){
                res.status(403).send("Token is not valid, please Re-Login to receive new Token");   //Validasi dengan crosscheck antara secret key dari JWT hasil login dengan secret key  dari file .env
            }
            req.user = user;
            // console.log(req.user);
            next();   
        })
    }else{
        return res.status(401).send("You are not authorized, please insert the Token");
    }
}

const verifyTokenAndAuthorization = (req,res,next)=>{                      //Fungsi untuk otorisasi Token dengan memanggil function verifyToken
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).send("Not Allowed to do such Action");
        }
    })
}

const verifyTokenAndAdmin = (req,res,next)=>{                      //Fungsi untuk meng-otentikasi Admin dengan memanggil function verifyToken
    verifyToken(req,res,()=>{
        if(req.user.isAdmin == true){
            next()
        }else{
            res.status(403).send("Not Allowed to do such Action");
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};

