const flash = require('express-flash')
const Order=require('../../../models/order')
const moment=require('moment')

function orderController(){
  
    return{

        store(req,res){

            const {phone,address}=req.body
            if(!phone||!address){

                req.flash('err','All fields are required')
                return res.redirect('/cart')
            }

            const order=new Order({
                
                phone:phone,
                address:address,
                customerId: req.user._id,
                items: req.session.cart.items

            })

            order.save().then( result=>{

                req.flash('success','Yay! Order Successful.')
                delete req.session.cart
                return res.redirect('customers/orders');

            }).catch(err=>{

                req.flash('err','Something wrong happened!Please try again.')
                return res.redirect('/cart')

            })
        },

        async orders(req,res){

            const orders=  await Order.find({ customerId: req.user._id }, null, {sort: {'createdAt': -1}})

            //to remove green icon order successfull after every page visit
            res.header('Cache-Control', 'no-store')  

            return res.render('customers/orders',{orders:orders,moment:moment})
        
        }

    }
    
    

}

module.exports=orderController