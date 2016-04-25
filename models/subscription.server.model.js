var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var subscriptionSchema = new Schema({
    name     : String,
    desc   : String
});

mongoose.model('Subscriptions', subscriptionSchema, 'Subscriptions');