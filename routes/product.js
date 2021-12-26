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

//UPDATE PRODUCT
router.put("/updateproduct/:id",verifyTokenAndAdmin, async(req,res)=>{
    try {
        const updateProd = await product.findByIdAndUpdate(req.params.id, req.body,{new:true})
        return res.status(201).send(updateProd);
    } catch (error) {
        return res.status(201).send(error);
    }
})

module.exports = router