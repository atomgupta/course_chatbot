const mongoose=require('mongoose');
const registrationSchema=new mongoose.Schema({
    name:String,
    address:String,
    email:String,
    phone:String,
    registerDate:Date
});
mongoose.model('registration',registrationSchema)