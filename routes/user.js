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
        // const updatedUser = await user.findByIdAndUpdate(req.params.id, {                    //Menggunakan method MongoDB untuk mencari user berdasarkan ID dan set/save object dari body postman melalui method findByIdAndUpdate()
        //     $set : req.body,
        // },{new:true});
        const updatedUser = await user.findByIdAndUpdate(req.params.id, req.body,{new:true});   //Menggunakan method MongoDB untuk mencari user berdasarkan ID dan set/save object dari body postman melalui method findByIdAndUpdate()
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

//SERVICE GET USER 
router.get("/find/:id", verifyTokenAndAdmin, async(req,res)=>{
    try {
        const findUser = await user.findById(req.params.id);        //Ngambilnya bukan dari body, tapi dari params yang ada di service
        const {password, ...User} = findUser._doc;
        return res.status(200).send(User);
    } catch (error) {
        return res.status(500).send(error);
    }
})

//SERVICE GET USERS and TOTAL USERS
router.get("/findusers", verifyTokenAndAdmin, async(req,res)=>{
    const query = req.query.new                                     //Query service
    const array = [];
    try {
        const findUsers = query ? await user.find().limit(5) : await user.find();

        /**
         * Hasil respond JSONnya menampilkan password dari setiap user yang di get
         * Untuk menghilangkan property 'password', object-object dalam array harus di iterasi menggunakan forEach
         * lalu menggunakan Object.assign({}, *namaParameter) dan 'delete' untuk menghapus object property atau object key
         */
        findUsers.forEach(x=>{                  
            const temp = Object.assign({}, x._doc);
            delete temp.password;
            // console.log(temp);
            array.push(temp);
        })

        /**
         * Jenis query dari MongoDB untuk menggabungungkan dokumen menjadi collection
         * Lalu digabungkan dengan query $group serta menghitung total user dengan $sum:1
         */

        const totalUsers = await user.aggregate(
            [
                {
                    $group:{
                        _id:null,
                        totalUsers:{$sum:1}
                    }
                }
            ]);
        totalUsers.map(x=>{
            array.push(x);
        })
        // console.log(array);
        return res.status(200).send(array);                 //JSON Structure => [{},{},....,{totalUsers}]
    } catch (error) {
        return res.status(500).send(error);
    }
})

/**
 * Service /stats meng-aggregate semua collection jadi satu
 * lalu di filter dengan menggunakan Query MongoDB NoSQL dengan $match dan $group
 * Methode Aggregate seperti menggunakan query, tapi querynya bukan MySQL tapi NoSQL
 * Lebih gampang pakai cara ini jika ingin menampilkan data sesuai kemauan kita tetapi pakainya agak ribet karena gw baru tau query jenis ini
 */
//SERVICE /stats
router.get('/stats',verifyTokenAndAdmin, async(req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));  //Tanggal dan tahun lalu 
    // console.log(lastYear);
    try {
        const data = await user.aggregate([
            {$match:{createdAt:{$gte:lastYear}}},                       //Menggabungkan collection dan di filter menggunakan query $match berdasarkan field createdAt dengan value dari variabel lastYear
            {
                $project:{
                    month:{$month:"$createdAt"}
                }
            },
            {
                $group:{                                                //Lalu query $group adalah query yang terkahir
                    _id:"$month",
                    total:{$sum:1}
                }
            }
        ]);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error);
    }
})
module.exports = router