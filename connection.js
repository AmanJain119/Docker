//connection.js
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var config = require('./config');
var db_name = config.env.database.name;

var product = new Schema({
    name: String,
    price: {type: Number, default: 0},
    quantity: {type: Number, default: 1}
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

//Create model for each Schema
mongoose.model('products', product);

//mongoose runs only on 27017 port 
mongoose.connect('mongodb://mongo:27017/' + db_name, {useMongoClient: true}, function (err, db)
{
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        console.log('Connected to database');
    }
});
