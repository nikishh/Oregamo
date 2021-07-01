const { json } = require("express")
const { update } = require("../../../models/menu");

function cartController(){

    return{

        cart(req,res){
            res.render('customers/cart')
        },

        update(req, res) {
          
            // creating empty cart for first time
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart

            //console.log(req.body);

            if(!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty +=1
                cart.totalPrice += req.body.price
            } else {
                cart.items[req.body._id].qty += 1
                cart.totalQty += 1
                cart.totalPrice += req.body.price
            }
            
            // console.log(req.session.cart.totalQty)
            return res.json({ totalQty: req.session.cart.totalQty })
        }
    }
}

module.exports= cartController