const mongoose=require("mongoose");
const imgSchema = new mongoose.Schema({
    description:String,
    author:String,
    location:String,
    img:{
        data:Buffer,
        contentType:String,
    }
})

module.exports = ImageModel = mongoose.model("Image",imgSchema);