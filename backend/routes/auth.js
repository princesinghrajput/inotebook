const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); //getting error
var fetchuser=require('../middleware/fetchuser');
const JWT_SECRET="kanakprince";

//ROUTE 1:  create a user using: POST "/api/auth/createUser". Doesnt required logIn

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a vaild email").isEmail(),
    body("password", "Password atleast must be of 5 character").isLength({
      min: 5,
    }), 
  ],
  async (req, res) => {

    //If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    //Check whether user with this mail is exist already
    
    try {
      
    
    let user= await User.findOne({email: req.body.email});

    
    if(user){
        return res.status(400).json({error:"Sorry a user with this email is already exists!"})
    }

    //create a salt
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    //create a new user
    user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      })

      //jwt token description-->getting error `MODULE_NOT_FOUND`
     const data = {
        user:{
          id: user.id
        }
      }

      const authtoken=jwt.sign(data, JWT_SECRET);

    // res.json(user);
    res.json({authtoken});

  } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured");
  }
  }
);

//ROUTE 2::: Authenticate a user using : POST "/api/auth/login" --no login required

router.post(
  "/login",
  [
    body("email", "Enter a vaild email").isEmail(),
    body("password", "Password cannot be blank").exists(), 
  ],
  async (req, res) => {
    //if there are error return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password}=req.body; //destructuring....

    try {
      let user=await User.findOne({email});
      if (!user) {
        return req.status(400).json({error: "Please try to login with correct credentials"});
      }
      const passwordCompare= await bcrypt.compare(password,user.password);
      if (!passwordCompare) {
        return req.status(400).json({error: "Please try to login with correct credentials"});

      }

      const data = {
        user:{
          id: user.id
        }
      
      }
      const authtoken=jwt.sign(data, JWT_SECRET);
      res.json({authtoken});

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  })

  //ROUTE 3: GET USER DETAIL USING : POST "/api/auth/getuser". Login reqired
  router.post(
    "/getuser", fetchuser, async (req,res) => {

 
  try {
    userId=req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
    })

module.exports = router;
