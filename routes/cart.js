const router = require('express').Router();
const cart = require('../Models/cart');
const { verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization } = require('./verifyToken');
const multer = require("multer");
const path = require('path');
var fs = require('fs');                         //Untuk membuat folder
var dir = '../uploads'
var sanitize = require("sanitize-filename");
const user = require('../Models/user');

router.post("/create",verifyToken, async(req,res)=>{
    const newCart = new cart(req.body);
    try {
        const save = await newCart.save();
        res.status(201).send(save);
    } catch (error) {
        res.status(400).send(error);
    }
})


router.put("/update/:id",verifyTokenAndAuthorization, async(req,res)=>{
    try {
        const updCart = await cart.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(201).send(updCart);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete("/delete/:id",verifyTokenAndAuthorization, async(req, res) =>{
    const delCart = await cart.findOneAndDelete(req.params.id);
    try {
        res.status(201).send("Cart Deleted",delCart);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get("/usercart/:userId",verifyTokenAndAuthorization, async(req, res) =>{
    try {
        const userCart = await cart.findOne({userId: req.params.userId});
        res.status(201).send(userCart);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get("/",verifyTokenAndAdmin,async(req, res)=>{
    const carts = await cart.find();
    try {
        res.status(201).send(carts);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router