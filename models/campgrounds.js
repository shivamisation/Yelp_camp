var mongoose = require("mongoose")
// Schema setup 

var campgroundsSchema = new mongoose.Schema({
    name : String ,
    image : String  ,
    comment : [
        {

            type: mongoose.Schema.Types.ObjectId ,
            ref : "Comment"
        }
    ]
})

var Campground = mongoose.model("Campgrounds", campgroundsSchema)

module.exports = Campground
