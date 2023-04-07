const mongoose = require('mongoose');
require('dotenv').config();

// mongoose.connect('mongodb://localhost:27017',{dbName:'Shop_Now'})
mongoose.connect(process.env.MongoUrl)  
.then(() =>console.log('Mongodb Conneted with cloud from helper') )
.catch((err)=>console.log('errMessage ',err.message));

mongoose.connection.on('conneted',()=>{
    console.log('mongoose connection CONNECTED')
})

mongoose.connection.on('error',(err)=>{
    console.log(err.message)
})

mongoose.connection.on('disconnect',()=>{
    console.log('mongoose connection is DIS-CONNECTED')
})

process.on('SIGINT',async()=>{
    await mongoose.connection.close();
    process.exit(0)
})