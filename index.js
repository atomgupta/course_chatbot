const express=require('express');
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const config=require('./config/keys')
require('./models/Registration');
require('./models/Demand')
require('./models/Coupons');
mongoose.connect(config.mongoURI,{useNewUrlParser:true})

const app=express();
app.use(bodyParser.json())


require('./routes/dialogflowroutes')(app)
require('./routes/fulfillmentRoutes')(app)

app.listen(process.env.PORT||5000,()=>{
    console.log('server running');
})