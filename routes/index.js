var mongoose = require('mongoose');
var Todo = mongoose.model('Todo');
//for catch the cookie
var utils    = require( '../utils' );


var index = function ( req, res ){
  var user_id = req.cookies ?
    req.cookies.user_id : undefined;

	console.log(user_id);

	Todo.find({ user_id : user_id }).
	sort('-updated_at').
	exec(function ( err, todos, count ){
		res.render( 'index', {
		title : 'Todo List',
		todos : todos
		});
	});
};

var create = function (req, res) {
	content = req.body.content;
	console.log(req.cookies.user_id);
	if (content) {
		new Todo({
			user_id : req.cookies.user_id,
			content : req.body.content,
			updated_at : Date.now(),
			status: "Todo"
			}).save(function( err, todo, count ){
				res.redirect( '/' );
			});
	}
	else {
		res.redirect( '/' );
	}

};


var destory = function ( req, res ){
	Todo.findById( req.params.id, function ( err, todo ){
		var user_id = req.cookies ?
			req.cookies.user_id : undefined;

		if( todo.user_id !== req.cookies.user_id ){
			return utils.forbidden( res );
		}

		todo.remove( function ( err, todo ){
			res.redirect( '/' );
		});
	});
};

var edit = function ( req, res ){
	var user_id = req.cookies ?
		req.cookies.user_id : undefined;
	Todo. find({ user_id : user_id }).
	sort('-updated_at').
	exec(function ( err, todos ){
		res.render( 'edit', {
			title : 'Todo List',
			todos : todos,
			current : req.params.id
		});
	});
};

var update = function ( req, res ){
	Todo.findById( req.params.id, function ( err, todo ){

		var user_id = req.cookies ?
			req.cookies.user_id : undefined;

		if( todo.user_id !== req.cookies.user_id ){
			return utils.forbidden( res );
		}
		if (req.body.content) {
			todo.content    = req.body.content;
			todo.save( function ( err, todo, count ){
			res.redirect( '/' );
			});
		}
		else {
			res.redirect( '/' );
		}

	});
};

var completed = function ( req, res ){
	Todo.findById( req.params.id, function ( err, todo ){

		var user_id = req.cookies ?
			req.cookies.user_id : undefined;

		if( todo.user_id !== req.cookies.user_id ){
			return utils.forbidden( res );
		}

		todo.status    = "Completed";
		todo.save( function ( err, todo, count ){
			res.redirect( '/' );
		});
	});
};

var checktodo = function ( req, res ){
	Todo.findById( req.params.id, function ( err, todo ){

		var user_id = req.cookies ?
			req.cookies.user_id : undefined;

		if( todo.user_id !== req.cookies.user_id ){
			return utils.forbidden( res );
		}

		todo.status    = "Todo";
		todo.save( function ( err, todo, count ){
			res.redirect( '/' );
		});
	});
};

exports.current_user = function ( req, res, next ){
  var user_id = req.cookies ?
      req.cookies.user_id : undefined;

  if( !user_id ){
    res.cookie( 'user_id', utils.uid( 32 ));
  }

  next();
};


exports.create = create;
exports.index = index;
exports.destory = destory;
exports.edit = edit;
exports.update = update;
exports.completed = completed;
exports.checktodo = checktodo;

