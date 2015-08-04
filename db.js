var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Todo = new Schema({
    user_id    : String,
    content    : String,
    updated_at : Date,
    status : String
});

mongoose.model( 'Todo', Todo );
                
var mongoUrl = 'mongodb://ciciyu:1111@ds047752.mongolab.com:47752/mongo1';

// mongoUrl = "mongodb://localhost/todo';
mongoose.connect( mongoUrl );