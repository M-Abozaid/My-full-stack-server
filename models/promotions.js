// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;


// create a schema
var promoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        unique: true
    },
    label: {
        type: String,
        default: "",
    },
    price: {
        type: Currency 
    },
    description: {
        type: String,
        required: true
    },    
     featured: {
        type: Boolean,
        default:false
    },
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Promotions = mongoose.model('promotion', promoSchema);

// make this available to our Node applications
module.exports = Promotions;