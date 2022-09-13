const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); //getting error

const JWT_SECRET="kanakprince";

//create a user using: POST "/api/auth/createUser". Doesnt required logIn

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
      console.log(authtoken);

    // res.json(user);
    res.json({authtoken});

  } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured");
  }
  }
);

module.exports = router;
