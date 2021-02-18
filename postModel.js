var mongoose = require('mongoose');

//what kind of fields will be there in collections
var PostSchema  = new mongoose.Schema({
    title:String,
    description:String,
    createBy:String,
    createrId:String,
    isActive:Boolean,
    tags:String,
    date:String,
    lastupdatedate:String
})
//mongoose.model('collection','schema)
mongoose.model('posts',PostSchema);
module.exports = mongoose.model('posts');