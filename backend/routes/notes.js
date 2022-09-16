const express=require('express');
const router=express.Router();
var fetchuser=require('../middleware/fetchuser');
const Notes=require('../models/Notes');
const { body, validationResult } = require("express-validator");

//ROUTE 1: GET ALL THE NOTES USING: GET: "/api/auth/getallnotes". required logIn
router.get('/fetchallnotes',fetchuser, async (req, res)=>{
    const notes=await Notes.find({user: req.user.id});
    res.json(notes)
    res.json([])
})

//ROUTE 2: ADD A NEW NOTES USING: GET: "/api/auth/Aaddnotes".  required logIn
router.get('/addnotes',fetchuser,[
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be of atleast 5 character").isLength({ min: 5 }),
   
], async (req, res)=>{
    const notes=await Notes.find({user: req.user.id});
    res.json(notes)
    res.json([])
})


module.exports=router