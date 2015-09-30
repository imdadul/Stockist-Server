var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var CronJob = require('cron').CronJob;

app.use(bodyParser.json())

fs = require('fs'),
mongoose = require('mongoose');



// Bootstrap db connection
// Connect to mongodb


var env = 'development';
var config = require('./config/config')[env];
var connect = function () {
    var options = {server: {socketOptions: {keepAlive: 1}}};
    mongoose.connect(config.db, options)
};

// Error handler
mongoose.connection.on('error', function (err) {
    console.log(err)
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
    connect();
});

connect();

var db = mongoose.connection;
db.once('open', function callback(err) {

    if (err) {
        console.log(err);
    }
    else {
        console.log("successfully connected to mongodb");
    }

});

// Bootstrap models
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
});

// Start the app by listening on <port>
var port = 3001;
require('./config/routes')(app)
app.listen(port);
console.log('Express app started on port ' + port);

var scrap = require('./app/process/scrap');
var startScrapingStores = new CronJob('00 30 3 * * 0-6', function () { // Every day at 4.30 am
        var scrap = require('./app/process/scrap');
    }, function () {

        /* This function is executed when the job stops */
    }
    //,true /* Start the job right now */
    //timeZone /* Time zone of this job. */
);

// expose app
exports = module.exports = app;
