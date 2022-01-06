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
         res.status(201).send(customer)
    } catch (error) {
         res.status(201).send(error)
    }
})

//Add card to existing cust
router.post("/updatecard/:id", async(req,res)=>{
    try {
        console.log(`Body Passed : `, req.body)
        const{
            cardNumber,
            cardExpMonth,
            cardExpYear,
            cardCVC,
            cardName,
            country,
            postal_code
        } = req.body
        if(!cardNumber||!cardExpMonth||!cardExpYear||!cardCVC||!cardName||!country||!postal_code){
            return res.status(400).send({
                Error:"Please input all fields"
            })
        }

        const card = await stripe.customers.createSource(
            req.params.id,
            {source: {
            name:cardName,
            number:cardNumber,
            exp_month:cardExpMonth,
            exp_year:cardExpYear,
            cvc:cardCVC,
            address_country:country,
            address_zip:postal_code
            }}
          );
            console.log(card)
        // const cardToken = await stripe.tokens.create({
        //     name:cardName,
        //     number:cardNumber,
        //     exp_month:cardExpMonth,
        //     exp_year:cardExpYear,
        //     cvc:cardCVC,
        //     address_country:country,
        //     address_zip:postal_code
        // })
        // console.log(cardToken);
        // const card = await stripe.customers.createSource(customerId,{
        //     source:`${cardToken.id}`
        // })
        

         res.status(201).send(card);
    } catch (error) {
         res.status(201).send(error);
    }
})
module.exports = router