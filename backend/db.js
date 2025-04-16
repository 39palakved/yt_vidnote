const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://porwalpalak10:1234cVpV@yt-notevid.8rq4idb.mongodb.net/vidnotedb?retryWrites=true&w=majority"
const connectToMongo = () => {
    mongoose.connect(mongoURI).then(()=>console.log("Connected")).catch((e)=>console.log(e.message))
} 
  module.exports = connectToMongo;
 
