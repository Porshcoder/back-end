const mongoose = require('mongoose');


// message schema or document structure
const msgSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true,
    },
    email :{
        type : String,
        require : true,
    },
    message :{
        type : String,
        require : true,  
    },
  
    
})


//create model
const Message = new mongoose.model('MESSAGE', msgSchema)

module.exports = Message;