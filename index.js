const express=require('express');
const app=express();
app.get('/',(req,res)=>{
    res.send({"hello":"there"})
})
app.listen(process.env.PORT||3000,()=>{
    console.log('server running');
})