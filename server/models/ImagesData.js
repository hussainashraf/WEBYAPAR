const mongoose = require('mongoose')
const ImageSchema = new mongoose.Schema({
    image:String
},{
    timestamps: true
})

const UserModel = mongoose.model("Image",ImageSchema)
module.exports = UserModel