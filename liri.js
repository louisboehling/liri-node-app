var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");

var keys = require('./keys.js');
var twitterKeys = keys.twitter;
var spotifyKeys = keys.spotify;

//methods 


//my-tweets: shows last 20 tweets

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
loadTweets();


//spotify-this-song

function spotifySong() {
     
    //setup
    var spotify = new Spotify(keys.spotify);

    //retreive info
    spotify.search({ type: 'track', query: 'Hello' }, function(err, data) {
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
spotifySong();


//movie-this

function movieInfo() {

    var queryUrl = "http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy";

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
movieInfo();





