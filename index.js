var express = require('express');
var app = express();
    fs = require('fs'),
    mongoose = require('mongoose'),
    require('./config/routes')(app)

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
app.listen(port);
console.log('Express app started on port ' + port);

var scrap = require('./app/process/scrap');

// expose app
exports = module.exports = app;
