const mongoose=require('mongoose');

const mongoURI="mongodb://localhost:27017/inotebook"

const connnectToMongo=()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to mongos successfully");
    })
}

module.exports=connnectToMongo;