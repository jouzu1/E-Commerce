/**
 * File route itu seperti controller, dimana kita bisa memberikan nama2 service atau endpointnya
 * Setelah itu, nama endpoint akan kita eksport ke index.js
 * index.js adalah main file
 */

const { route } = require('express/lib/application');
const user = require('../Models/user');


const router = require('express').Router();

const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');


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

     
//UPDATE DATA USER
/**
 * Service ini adalah untuk update data user
 * Untuk update data user menggunakan Token yang harus di verifikasi terlebih dahulu
 */

router.put("/update/:id", verifyTokenAndAuthorization, async(req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(                           //Jika ingin merubah password, block code ini akan meng-encrypt ulang kembali password yang sudah kita ubah
            req.body.password,
            process.env.PASSWORD
        ).toString();
    }
    try {
        const updatedUser = await user.findByIdAndUpdate(req.params.id, {   //Menggunakan method MongoDB untuk mencari user berdasarkan ID dan set object dari body postman melalui method findByIdAndUpdate()
            $set : req.body,
        },{new:true});
        const {password, ...noDisplayingPassword} = updatedUser._doc;
        // console.log(noDisplayingPassword);
        return res.status(201).send(noDisplayingPassword);
    } catch (error) {
        return res.status(500).send(error)
    }
})

//DELETE USER 
/**
 * SERVICE DELETE USER
 * Untuk memakai service ini, dibutuhkan token dari user yang sudah login (hit service login) dan memiliki/mempunyai role admin
 */
router.delete('/delete/:id', verifyTokenAndAdmin, async(req,res)=>{     
    try {
        await user.findByIdAndDelete(req.params.id);                    //Menggunakan method MongoDB untuk mencari user berdasarkan ID dan menghapus user tersebut, namun user yang bisa menghapus harus memilkik role admin
        res.status(201).send("User telah terhapus");
    } catch (error) {
        res.status(500).send("Delete error");
    }
})

module.exports = router