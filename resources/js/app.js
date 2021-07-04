import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'

let addToCart=document.querySelectorAll('.add-to-cart')

let cartCounter=document.querySelector('#cartCounter')

function updateCart(food){

    axios.post('/update-cart',food).then(res=>{

        cartCounter.innerText=res.data.totalQty
        
        new Noty({

            type: 'success',
            timeout: 1000,
            text: 'Item added to cart',
            progressBar: false

        }).show();
    }).catch(err =>{

        new Noty({
          
            type: 'error',
            timeout: 1500,
            text: 'Something went wrong',
            progressBar:false

        }).show() 

    })

}

addToCart.forEach((btn)=>{

    btn.addEventListener('click',(e)=>{
        
        let food= JSON.parse(btn.dataset.food)

        updateCart(food)

    })
})

const alertMessage = document.querySelector('#success-alert')

if(alertMessage) {

    setTimeout(() => {
        alertMessage.remove()
    }, 3000)

}

initAdmin()

let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

updateStatus(order);

let socket = io()

if(order) {
    socket.emit('join', `order_${order._id}`)
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})