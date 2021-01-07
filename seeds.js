var mongoose = require("mongoose")

var Campground = require("./models/campgrounds")
var Comment = require("./models/comment")

var data = [
    {
        name : "Shivam Kumar" ,
        image : "https://images.unsplash.com/photo-1438786657495-640937046d18?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8aGlsbHN8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },

    {
        name : "Shivam Kumar" ,
        image : "https://images.unsplash.com/photo-1438786657495-640937046d18?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8aGlsbHN8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },

    {
        name : "Shivam Kumar" ,
        image : "https://images.unsplash.com/photo-1438786657495-640937046d18?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8aGlsbHN8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },

    {
        name : "Shivam Kumar" ,
        image : "https://images.unsplash.com/photo-1438786657495-640937046d18?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8aGlsbHN8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80"
    },

    {
        name : "Shivam Kumar" ,
        image : "https://images.unsplash.com/photo-1438786657495-640937046d18?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8aGlsbHN8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&w=1000&q=80"
    }

]

function seedDB(){

Campground.remove({} , function(err ){
    if(err){
        console.log(err) ;
    }
    else {
        console.log("campground has been removed ")


            data.forEach(function(seed){
                Campground.create(seed, function(err , campground){
                    if(err){
                        console.log(err) ;

                    }
                    else{
                        console.log("added a campground")

                        // create a comment
                        Comment.create({
                            text : "this place is great...btw..." ,
                            author : "shivam"

                        } , function(err , comment){

                            if(err){
                                console.log(err)
                            }

                            else{
                                campground.comment.push(comment) ;
                                campground.save() ;
                                console.log("created a new comment")
    

                            }

                        })

                       
                    }

                })
            })
    }
})

}

module.exports = seedDB ; 
