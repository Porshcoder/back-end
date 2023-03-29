// import all dependencies
const dotenv = require('dotenv');
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

// configure env file & require connection file
dotenv.config({path : './config.env'});
require('./db/conn')
const port = process.env.PORT;

//require model

const Users = require('./models/userSchema');

//these method is used to get data and cookies from frontend
app.use(express.json());
app.use(express.urlencoded({extended : false}))
app.use(cookieParser())

app.get('/', (req, res) =>{
    res.send("hello world");
})

// registion
app.post('/register', async (req, res) =>{
    try {
      // get body or data
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    
    const createUser = new Users({
        username : username,
        email : email,
        password : password

    });

    //save method is used to create user or insert user
    // but before saving or inserting, password will hash
    //because of hashing.after hash, it will save to the db 

    const created = await createUser.save();
    console.log(created);
    res.status(200).send('Registered');

    } catch (error) {
      res.status(400).send(error)  
    }
})
// login user
app.post('/login', async(req, res) =>{
  try {
    const email = req.body.email;
    const password = req.body.password;

  //  find user if exist
    const user = await Users.findone({email : email});
    if(user){
      //verify password
      const isMatch = await bcryptjs.compare(password, user.password)

      if(isMatch){
        // generate token which is define in user schema
        const token = await user.generateToken();
        res.cookie("jwt", token, {
          //Expires Token in a 24 Hours
          expires : new Date(Date.now() + 86400000),
          httpOnly : true
        })
        res.status(200).send("LoggedIn")
      }else{
        res.status(400).send("Invalid Credentials");
      }
    }else{
      res.status(400).send("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send(error)
  }
})
    


// Run Server
app.listen(port, () =>{
    console.log("Server is Listening")
})

// our backend is done and store data in database
//now its time to connect front end to backend
