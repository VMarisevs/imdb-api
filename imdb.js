// Import the fs module so that we can read in files.
var fs = require('fs');
// Import express to create and configure the HTTP server.
var express = require('express');

// Read in the text file and parse it for JSON.
var data = JSON.parse(fs.readFileSync('ratings.json','utf8'));

// Create a HTTP server app.
var app = express();

// When a user goes to /, return a small help string.
app.get('/', function(req, res) {
  res.send('Try http://127.0.0.1:8000/movie/id/123 or http://127.0.0.1:8000/movie/year/1900.');
});

// Send back the JSON for movie i at /movie/id/i.
app.get('/movie/id/:id', function(req, res) {
  res.json(data[req.params.id]);
});


// Exercise 2
// http://127.0.0.1:8000/movie/year/1900
app.get('/movie/year/:year',
	function (req, res){
		var result = [];
		data.forEach(
			function(movie){
				if (movie.year == req.params.year)
					result.push(movie);
			}
		);
		
		res.json(result);
	}
);


// Exercise 3/4
app.get('/movie/random', function(req, res) {
	var result = [];
	
	// if the parameter is not defined, then assign value of 1
	var nomovies = (req.query.nomovies) ? req.query.nomovies : 1;
	
	for (var i = 0; i < nomovies; i++){
		random =  Math.floor(Math.random() * (data.length - 0 + 1)) + 0;
		result.push(data[random]);
	}

	res.json(result);
});


/* Advanced */
app.get('/movie/search/:search',
	function (req, res){
		
		var result = [];
		var searchParam = req.params.search;
		
		data.forEach(
			function(movie){
				/*
					RegExp allows to separate the words in a string to be searched
					To make everything case insensitive, I made the searchable string and search element upper case
				*/
				var regex = new RegExp('\\b' + searchParam.toUpperCase() + '\\b');
				if (movie.title.toUpperCase().search(regex) != -1)
					result.push(movie);
			}
		);
		
		res.json(result);
	}
)

// Start the server.
var server = app.listen(8000);