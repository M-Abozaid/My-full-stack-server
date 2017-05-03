// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//require('mongoose-currency').loadType(mongoose);
//var Currency = mongoose.Types.Currency;
var dishIdSchema = new Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }
})

var favoriteSchema = new Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
   dishesId:[dishIdSchema] 
   
}, {
    timestamps: true
});


// the schema is useless so far
// we need to create a model using it
var Favorites = mongoose.model('Favorite', favoriteSchema);


// make this available to our Node applications
module.exports = Favorites;