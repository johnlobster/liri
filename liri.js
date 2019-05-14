// lilri
// read command line arguments and use to find music, bands
// John Webster

require("dotenv").config();
// keys for spotify
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var axios = require("axios");
var sprintf = require('sprintf-js').sprintf; // string formatter
var chalk = require("chalk"); // allows for colored text
var fs = require("fs");

var randomFileName = "temp.txt"; // default is random.txt
var songName = ""; // global variable so can be called by recursive function spotifyGet
var logfileName = "log.txt";

function liriHelp() {
    console.log("How to use liri\n");
    process.exit();
}

// get movie data
function omdbAccess() {
    var movieName = "";
    if ( args === []) {
        // no movie given so ...
        movieName = "mr.+nobody";
        console.log("No movie name given ...\n");
    }
    else {
        movieName = args.join("+");
    }
    // console.log("Movie name " + movieName);
    axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy").then(
    function (response) {
        console.log("The movie's rating is: " + response.data.imdbRating);
    })
    .catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
        }
        console.log(error.config);
    });
}

// Name of the venue

// Venue location

// Date of the Event(use moment to format this as "MM/DD/YYYY")
// "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

function bandAccess() {
    var name = "";
    if (args.length === 0) {
        // no band specified
        console.log(chalk.red("\nNo band name specified"));
        liriHelp();

    }
    else {
        name = args.join("+").toLowerCase();
    }
    axios.get("https://rest.bandsintown.com/artists/" + name + "/events?app_id=codingbootcamp").then(
    function (response) {
        console.log(response);
        console.log("*****************************");
        console.log(response.data);
        console.log(response.data.datetime);
        console.log(response.data.venue);

    })
    .catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
        }
        console.log(error.config);
    });
    

}
function spotifyAccess() {
    if ( args.length === 0) {
        // nothing specified so Ace of Bass
        songName ="the sign";
    } 
    else {
        songName = args.join(" ").toLowerCase();
    }
    // console.log("Song name: " + songName);
    spotifyGet();
    
}


function spotifyGet() {
    spotify.search({ type: 'track', query: songName, limit: 20 }, function (err, data) {
        if (err) {
            return console.log(chalk.red('Error occurred in spotify access : ' + err + "\n"));
        } 
        else {
            // spotify doesn't search for exact track, so need to search results
            for (let i = 0; i < data.tracks.items.length; i++) {
                // console.log(data.tracks.items[i].name);
                if (songName === data.tracks.items[i].name.toLowerCase()) {
                    // log information
                    myLog(sprintf("     %-15s  %s", "Artist", data.tracks.items[i].artists[0].name), "green");
                    myLog(sprintf("     %-15s  %s","Song name", data.tracks.items[i].name), "green");
                    myLog(sprintf("     %-15s  %s", "Web link", data.tracks.items[i].album.external_urls.spotify), "green");
                    myLog(sprintf("     %-15s  %s", "Album", data.tracks.items[i].album.name), "green");

                    // console.log("found it " + data.tracks.items[i].artists[0].name);
                    // console.log(data.tracks.items[i].artists[0].name);
                    // finish the node program as found an answer
                    process.exit();
                }
            }
            // didn't find the exact match
            console.log(chalk.red("\nCould not find the song " + songName + " on spotify - try something different"));
        }

    });
}
function choose() {
    switch (command) {
        case "":
            // invalid command
            console.log("No command entered");
            liriHelp();
        case "help":
        case "-help":
        case "--help":
            liriHelp();
        case "concert-this":
            ;bandAccess()
            break;
        case "movie-this":
            omdbAccess();
            break;
        case "spotify-this-song":
            spotifyAccess();
            break;
        case "do-what-it-says":
            // read command and arguments from randomFileName file
            fs.readFile(randomFileName, "utf8", function (error, data) {

                // If the code experiences any errors it will log the error to the console.
                if (error) {
                    return console.log(chalk.red("Error reading file " + randomFileName + " " + error));
                } 
                // split data by commas 
                var dataArr = data.split(",");
                command = dataArr[0];
                args = dataArr[1].split(" ");

                // run choose function recursively
                choose();

            });
            break;
        default:
            // invalid command
            console.log(chalk.red("can't process command " + command + "\n"));
            liriHelp();
    }
}

// send to console.log and append to log file
function myLog (inputString, color) {
    // send to console in color
    switch( color ) {
        case "red":
            console.log(chalk.red(inputString));
            break;
        case "green":
            console.log(chalk.green(inputString));
            break;
        case "blue":
            console.log(chalk.blue(inputString));
            break;
        case "magenta":
            console.log(chalk.magenta(inputString));
            break;
        default:
           console.log(chalk.red("\nInternal error : liri does not recognise the color" + color));
    }
    // send to log file
    fs.appendFileSync(logfileName, inputString + "\n", function (error) {
        if (error) {
            console.log(chalk.red("Logfile append error: " + error));
        }
    });

}

// main program begins here

// process arguments
var command= process.argv[2];
var args = process.argv.slice(3);

console.log(chalk.magenta("liri is thinking ......\n"));

// set up log file
fs.appendFileSync(logfileName, "\nOn " + moment().format("Do MMMM YYYY hh:mma") + " liri processed \" " + command + " " + args.join(" ") + "\"\n", function (error) {
    if (error) {
        console.log(chalk.red("Logfile append error: " + error));
    }
});

choose();


