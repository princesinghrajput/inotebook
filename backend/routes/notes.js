const express=require('express');
const router=express.Router();


router.get('/', (req, res)=>{
    obj={
        a:'this is a notes',
        number:88685
    }
    res.json(obj)
})

module.exports=router