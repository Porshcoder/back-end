const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// user schema or document structure
const userSchema = new mongoose.Schema({
    username : {
        type : String,
        require : true,
        unique : true
    },
    email :{
        type : String,
        require : true,
        unique : true,
    },
    password :{
        type : String,
        require : true,  
    },
    // confirm  :{
    //     type : String,
    //     require : true,  
    // },
    tokens :[
       {
        token : {
            type : String,
            require : true  
        }
    }
    ]
})

//hashing password to secure
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = bcryptjs.hashSync(this.password, 10);
    }
    next();
})

// generate tokens to verify user
userSchema.methods.generateToken = async function(){
    try {
        let generatedToken = jwt.sign({_id : this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token : generatedToken});
        await this.save();
        return generatedToken;
    } catch (error) {
        console.log (error)
    }
}

//create model
const Users = new mongoose.model('USER', userSchema)

module.exports = Users;