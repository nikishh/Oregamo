require('dotenv').config()
const express = require('express')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const mongoose = require('mongoose')
const session =require('express-session')
const flash =require('express-flash')
const MongoStore = require('connect-mongo')
const bodyParser = require('body-parser')
const passport=require('passport')
const port=process.env.port || 3000

const app=express()

// connect db
const url = process.env.URL ;

mongoose.connect(url, {useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true})

const connection= mongoose.connection;

connection.once('open',()=>{
    console.log('db connected')
}).catch(err=>{
    console.log(err)
})


// session

app.use(session({
  secret: process.env.SECRET_COOKIE,
  store: MongoStore.create({mongoUrl: url}),
  resave: false,
  saveUninitialized: false,
  cookie:{maxAge: 60*60*12*1000}
}));


//passport
const passportInit=require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//assests 
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.use((req,res,next)=>{
    res.locals.session=req.session
    res.locals.user=req.user
    next()
})

app.use(expressLayout)
app.set('views',path.join(__dirname+'/resources/views')) 
app.set('view engine','ejs')


require('./routes/web')(app)


app.listen(port,(err)=>{
    if(!err){
        console.log(`Server Started at port ${port}!`)
    }
})