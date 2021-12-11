/**
 * File route itu seperti controller, dimana kita bisa memberikan nama2 service atau endpointnya
 * Setelah itu, nama endpoint akan kita eksport ke index.js
 * index.js adalah main file
 */

const { route } = require('express/lib/application');


const router = require('express').Router();

/**
 * 
 * 
 * 
 *                                      TESTING
 * 
 * 
 * 
 */



router.get("/usertest",(req,res)=>{         //Ini nama service/endpointnya dengan menggunakan methode GET, dan ini masih DUMMY
    res.send("User Test Berhasil")
})

router.post("/usertest",(req,res)=>{        //Nama service dengan method POST tetapi object yang ditulis melalui body tidak akan sampai ke DB karena ini masih DUMMY
    /**
     * { "username":"Jouzu" }
     */
    const username = req.body.username;
    res.send(username)
    // console.log(username);           
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




module.exports = router