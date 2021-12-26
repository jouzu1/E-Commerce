const router = require('express').Router();
const product = require('../Models/product');
const { verifyTokenAndAdmin } = require('./verifyToken');
const {uploadFileMiddleware} = require('../upload');

//CREATE PRODUCT SERVICE
router.post("/create",verifyTokenAndAdmin, async(req,res)=>{
    const newProd = new product(req.body);
    try {
        const savedProd = await newProd.save();
        res.status(201).send(savedProd);
    } catch (error) {
        res.status(500).send(error);
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