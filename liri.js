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