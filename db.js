var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Todo = new Schema({
    user_id    : String,
    content    : String,
    updated_at : Date,
    status : String
});

mongoose.model( 'Todo', Todo );

var mongoUrl = 'mongodb://hanweifish:victor@ds061391.mongolab.com:61391/todo-list';

// mongoUrl = "mongodb://localhost/todo';
mongoose.connect( mongoUrl );