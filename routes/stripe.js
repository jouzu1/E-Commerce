const router = require('express').Router();
const user = require('../Models/user')
const stripe = require('stripe');
const stripeAuth = stripe('sk_test_51KDfusArJvfa50cfl68k2OEFChzHPplQmo55sX9pCa2iOxAg4L4Q58gKfdDCu1usc1PsLWXP5IJi2uqBzToSlGLL00VrvVEFNn')

// router.post("/payment", async(req,res)=>{
//     stripe.charges.create(
//         {
//             source: req.body.tokenId,
//             amount: req.body.amount,
//             currency:"usd"
//         },
//         (stripeErr, stripeRes)=>{
//             if(stripeErr) {
//                 res.status(500).send(stripeErr);
//             }else{
//                 res.status(500).send(stripeRes);
//             }
//         }
//     )
// })

//CREATE Customer
router.post("/newCust", async(req,res)=>{
    try {
        const User = await user.findById(req.body.id)
        const customer = await stripeAuth.customers.create({
            name : User.username,
            email : User.email
        })
        return res.status(201).send(customer)
    } catch (error) {
        return res.status(201).send(error)
    }
})

module.exports = router