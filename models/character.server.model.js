var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var characterSchema = new Schema({
    name     : String
});

mongoose.model('Characters', characterSchema, 'Characters');
