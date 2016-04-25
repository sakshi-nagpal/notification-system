var mongoose = require('mongoose'),
    path     = require('path'),
    express = require('express'),
    http = require('http'),
    chalk = require('chalk'),
    glob = require('glob'),
    io = require('socket.io');
 
var app = express();

var DB_HOST =process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost';
var dbConfig = {
    url: 'mongodb://' + DB_HOST + '/notification',
    port : 3000
};

/*Set EJS template Engine*/
// Set views path
app.set('views','./views');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

// Globbing model files
glob.sync( './models/*.js' ).forEach( function( modelPath ) {
    require(path.resolve(modelPath));
});
var User = mongoose.model('Users'),
    Activities = mongoose.model('Activities'),
    Subscription = mongoose.model('Subscriptions'),
    Character = mongoose.model('Characters');

// Start the app by listening on <port>
io = io.listen(app.listen(dbConfig.port, function() {
    console.log('--');
    console.log(chalk.green('Application listening on port number', dbConfig.port));
    console.log(chalk.green('Database:\t\t\t' + dbConfig.url));
}));

// connection to the db through mongoose    
var db = mongoose.connect(dbConfig.url);

db.connection.on('open', function callback() {

    io.sockets.on('connection', function (socket) {

        function insertNotifications(){
            User.find({}).populate('subscriptions.subscriptionType')
                .populate('subscriptions.characterId').exec()
                .then(function(users, err) {

                    if(err) {
                        console.info('error : ', err);
                        return;
                    }
                    users.forEach(function(user){
                        var notificationNum = 10* Math.random();
                        var activityObj = new Activities({
                            desc : "Notification_"+notificationNum,
                            characterId : user.subscriptions[0].characterId._id,
                            type : user.subscriptions[0].subscriptionType._id,
                            read: false
                        });

                        activityObj.save().then(function(){
                            console.log("New activity has been added");
                        },function(err){
                            console.log("Error in saving new Activity", err)
                        })

                    });


                })

        }

        // adding notifications after every 20 sec in Activities for each User 
        setInterval(insertNotifications, 20000);


        /*Event Handlers*/
        socket.on('subscription', function (obj) {
            User.findOne({_id:obj.user})
                .populate('subscriptions.subscriptionType')
                .populate('subscriptions.characterId')
                .exec()
                .then(function(subs){
                    socket.emit('subscription', {subs: subs});

                });
        });
         var collection = mongoose.connection.db.collection('Activities');

        socket.on('notification', function(obj) {
            /* Create tailable cursor for capped collection Activities */

            var stream = collection.find({  }, {
                tailable: true,
                awaitdata: true,
                numberOfRetries: Number.MAX_VALUE
            }).stream();

            stream.on('data', function(activity) {

                if( activity.read == false && activity.type == obj.typeId && activity.characterId == obj.characterId) {
                    socket.emit('notify', {obj:activity});
                    activity.read = true;
                    Activities.update({_id:activity._id}, {$set : {read : true}}, function(err, num, n){

                        if(err)
                            throw err;
                        console.log("update",num,n)
                    });
                }
            });

            stream.on('error', function(val) {
                console.log('Error in stream');
            });

            stream.on('end', function(){
                console.log('Stream Ended');
            });
        });

        socket.on('disconnect', function() {
            console.log('disconnected');
           clearInterval(insertNotifications);
        });
        socket.on('end', function (){
            console.log('disconnected');
            socket.disconnect(0);
        });
        socket.on('error', function() {
            console.log('error');
            clearInterval(insertNotifications);
        })
    });
});

db.connection.on('error', function () {
    console.error(chalk.red('Error:: \t\t\t MongoDB connection error!!!!'));
    console.log(chalk.red(err));
    process.exit(-1);

});

/*Render index.html as homepage*/
app.get('/',function(req,res){
    res.render('index.html',{title:"Notification System"});
});

/* Get Users from database */
app.get('/users',function(req,res){
    User.find({})
        .exec()
        .then(function(users, err) {

            if(err) {
                console.info('error : ', err);
            } else {
                res.send(users);
            }
        })
});


// Expose app
exports = module.exports = app;

