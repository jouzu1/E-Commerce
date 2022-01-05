const router = require('express').Router();
const cart = require('../Models/cart');
const { verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization } = require('./verifyToken');
const multer = require("multer");
const path = require('path');
var fs = require('fs');                         //Untuk membuat folder
var dir = '../uploads'
var sanitize = require("sanitize-filename");
const user = require('../Models/user');
const order = require('../Models/order');

//CREATE
router.post("/create",verifyToken, async(req,res)=>{
    const newOrder = new order(req.body);
    try {
        const save = await newOrder.save();
        res.status(201).send(save);
    } catch (error) {
        res.status(400).send(error);
    }
})

//UPDATE
router.put("/update/:id",verifyTokenAndAuthorization, async(req,res)=>{
    try {
        const updOrder = await order.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(201).send(updOrder);
    } catch (error) {
        res.status(400).send(error);
    }
})

//DELETE
router.delete("/delete/:id",verifyTokenAndAuthorization, async(req, res) =>{
    const delOrder = await order.findOneAndDelete(req.params.id);
    try {
        res.status(201).send("Order Deleted",delOrder);
    } catch (error) {
        res.status(500).send(error);
    }
})

//GET 
router.get("/order/:userId",verifyTokenAndAuthorization, async(req, res) =>{
    try {
        const userOrder = await order.findOne({userId: req.params.userId});
        res.status(201).send(userOrder);
    } catch (error) {
        res.status(500).send(error);
    }
})

//GET ALL
router.get("/",verifyTokenAndAdmin,async(req, res)=>{
    const orders = await order.find();
    try {
        res.status(201).send(orders);
    } catch (error) {
        res.status(500).send(error);
    }
})


//SERVICE MONTHLY INCOME WITH AGGREGATE() METHOD    
router.get("/income", async(req,res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await order.aggregate([
            {$match:{createdAt:{$gte:previousMonth}}},
            {
                $project:{
                    month:{$month:"$createdAt"},                //Value yang ada di property (createdAt), itu ngambilnya dari property yang ada di document MongoDB
                    sales:"$amount"                         
                }
            },
            {
                $group:{
                    _id:"$month",                               //Value $month diambil dari fieldnya $project yang month
                    total:{$sum:1}
                }
            }
        ]);
        return res.status(200).send(income);
    } catch (error) {
        return res.status(404).send(error);
    }
})
module.exports = router