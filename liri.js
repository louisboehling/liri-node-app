var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var liriCommand = process.argv[2];

var keys = require('./keys.js');
var twitterKeys = keys.twitter;
var spotifyKeys = keys.spotify;


// switch cases

switch (liriCommand) {
    case "my-tweets": loadTweets(); break;
    case "spotify-this-song": spotifySong(); break;
    case "movie-this": movieInfo(); break;
    case "do-what-it-says": doWhatItSays(); break;
};


//methods 


//my-tweets

function loadTweets() {

    //setup
    var client = new Twitter(twitterKeys);
    var params = {screen_name: 'rlbApiTest', count: 20};

    //retrieve tweets
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log(
                '\n------------------------\n' + 
                'Latest Tweets:\n' + 
                '------------------------\n');
            for(var i = 0; i<tweets.length; i++){
                var date = tweets[i].created_at;
                console.log("@rlbApiTest: " + tweets[i].text + "\n" + "Created On: " + date.substring(0, 19));
                console.log("\n");}
        } else {
            console.log("error");
        }
      });
}


//spotify-this-song

function spotifySong() {
     
    //setup
    var spotify = new Spotify(keys.spotify);
    var songSearch = process.argv[3];
    if(!songSearch){
        songSearch = "Hello";
    }

    //retreive info
    spotify.search({ type: 'track', query: songSearch }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        var songInfo = data.tracks.items[0];
       
        console.log(
        '------------------------\n' + 
        'Song Information:\n' + 
        '------------------------\n\n' + 
        'Song Name: ' + songInfo.name + '\n'+ 
        'Artist: ' + songInfo.artists[0].name + '\n' + 
        'Album: ' + songInfo.album.name + '\n' + 
        'Preview: ' + songInfo.preview_url + '\n'
        ); 
      });
}


//movie-this

function movieInfo() {

    var movieSearch = process.argv[3];
    if(!movieSearch){
        movieSearch = "Mr Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=trilogy";

	request(queryUrl, function(error, response, body) {
	  
	  if (!error && response.statusCode === 200) {

        var movie = JSON.parse(body);
        
        console.log(
        '------------------------\n' + 
        'Movie Information:\n' + 
        '------------------------\n\n' + 
        'Title: ' + movie.Title + '\n'+ 
        'Release: ' + movie.Year + '\n' + 
        'IMDB Rating: ' + movie.imdbRating + '\n' + 
        'Country Produced In: ' + movie.Country + '\n' +
        'Language: ' + movie.Language + '\n' +
        'Plot: ' + movie.Plot + '\n' + 
        'Actors: ' + movie.Actors);
	  }
	});
}


//do-what-it-says


function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (!error) {
            var dataArr = data.split(',');
            if (dataArr[0] === 'spotify-this-song') {
                spotifySong(dataArr[1]);
            }
            if (dataArr[0] === 'movie-this') {
                movieInfo(dataArr[1]);
            }
            if (dataArr[0] === 'my-tweets') {
                loadTweets(dataArr[1]);
            }
        }
        else {
            console.log("there was an error");
        }
    });
}