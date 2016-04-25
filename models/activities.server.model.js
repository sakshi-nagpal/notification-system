var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var activitySchema = new Schema({
    characterId:{
        type: Schema.Types.ObjectId,
        ref: 'Characters'
    },
    type:{
        type: Schema.Types.ObjectId,
        ref: 'Subscriptions'
    },
    desc     : String,
    read: Boolean
});

mongoose.model('Activities', activitySchema, 'Activities');