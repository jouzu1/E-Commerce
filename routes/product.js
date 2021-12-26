const router = require('express').Router();
const product = require('../Models/product');
const { verifyTokenAndAdmin } = require('./verifyToken');

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
        arrTotal.push(prod,totalProd);
        res.status(200).send(arrTotal); 
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router