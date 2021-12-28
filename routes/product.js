const router = require('express').Router();
const product = require('../Models/product');
const { verifyTokenAndAdmin } = require('./verifyToken');
const multer = require("multer");
const path = require('path');
var fs = require('fs');                         //Untuk membuat folder
var dir = '../uploads'
var sanitize = require("sanitize-filename");

/**
 * Kondisi dibawah ini untuk membuat direktori/folder uploads di folder E-Commerce
 * Dicek apakah ada folder uploads menggunakan methode fs.existsSync()
 * Jika tidak ada, membuat folder baru menggunakan fs.mkdirSync()
 */
if(fs.existsSync(path.join(__dirname,dir
    ))){

    }else{
        fs.mkdirSync(path.join(__dirname,dir
        ))
    }

/**
 * const diskStorage berguna untuk memasukkan file yang sudah di Upload kedalam folder uploads
 */
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../uploads"));
    },
    // konfigurasi penamaan file yang unik
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

const upload = multer({
    storage: diskStorage,
    // dest:'images',
    limits:{ fileSize:10000000},
})

//CREATE PRODUCT SERVICE
router.post("/create",verifyTokenAndAdmin, upload.single('img'),async(req,res)=>{
    try {
        req.body.img = sanitize(req.file.path);                             //Membersihkan nama filepath dengan sanitize()
        req.body.size = fs.statSync(req.file.path).size/(1024*1024);        //Menambahkan keterangan ukuran file
        req.body.fileType = path.extname(req.file.path);
        const prod = new product(req.body);
        const saveProd = await prod.save();
        return res.status(201).send(saveProd);
    } catch (error) {
        return res.status(500).send(error);
    }
})

//GET PRODUCTS
router.get("/getproducts", verifyTokenAndAdmin, async(req, res)=>{
    const prod = await product.find();
    const arrTotal = [];
    try {
        const totalProd = await product.aggregate(
            [
                {
                    $group:{
                        _id:null,
                        totalProducts:{$sum:1}
                    }
                }
            ]
        )
        prod.map(x=>{
            arrTotal.push(x);
        })

        totalProd.map(x=>{
            arrTotal.push(x);
        })

        res.status(200).send(arrTotal); 
    } catch (error) {
        res.status(500).send(error);
    }
})

//GET PRODUCT
router.get("/",verifyTokenAndAdmin, async(req, res)=>{
    const qNew = req.query.new;                                 //Nama query untuk di service nya 'new'
    const qCategories = req.query.category;                     //Nama querynya pas di service nya 'category'
    const qTitle = req.query.title;                     //Nama querynya pas di service nya 'category'
    try {
        let qNewProduct;
        if(qNew){
            qNewProduct = await product.find().sort({createdAt:-1}).limit(50);
        }else if(qCategories){
            qNewProduct = await product.find({categories:{$in:[qCategories]}});     //Nyari berdasarkan array categories dengan memasukkan query params'category' di POSTMAN 
        }else if(qTitle){
            qNewProduct = await product.find({title:qTitle});                       //Nyari berdasarkan query 'title' dengan memasukkan field title ke dalam query .find({title:qTitle})
        }
        return res.status(200).send(qNewProduct);
    } catch (error) {
        return res.status(500).send(error);
    }
})

//UPDATE PRODUCT
router.put("/updateproduct/:id",verifyTokenAndAdmin, async(req,res)=>{
    try {
        const updateProd = await product.findByIdAndUpdate(req.params.id, req.body,{new:true})
        return res.status(201).send(updateProd);
    } catch (error) {
        return res.status(201).send(error);
    }
})

//DELETE PRODUCT 
router.delete("/delete/:id",verifyTokenAndAdmin, async(req, res)=>{
    try {
        const deleteProd = await product.findByIdAndDelete(req.params.id);
        return res.status(200).send("Product has been deleted");
    } catch (error) {
        return res.status(201).send(error);
    }
    
})
module.exports = router