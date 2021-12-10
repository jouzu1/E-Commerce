/**
 * File route itu seperti controller, dimana kita bisa memberikan nama2 service atau endpointnya
 * Setelah itu, nama endpoint akan kita eksport ke index.js
 * index.js adalah main file
 */


const router = require('express').Router();

router.get("/usertest",(req,res)=>{
    res.send("User Test Berhasil")
})

module.exports = router