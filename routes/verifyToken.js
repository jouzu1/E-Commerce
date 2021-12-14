/**
 * File ini digunakan untuk export token ke route user.js
 * Token didapatkan dari service login, lalu tokennya digunakan dalam service update
 */

const jwt = require('jsonwebtoken');

//Fungsi di bawah ditulis dalam bentuk ES6
const verifyToken = (req,res,next) => {                                 //Fungsi untuk verify Token
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader;
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

const verifyTokenAndAuthorization = (req,res,next)=>{                      //Fungsi untuk otorisasi Token dengan memanggin function verifyToken
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).send("Not Allowed to do such Action");
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization};

