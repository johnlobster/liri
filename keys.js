// supplies key information for spotify
require("dotenv").config({ debug: process.env.DEBUG });
// console.log('Loading keys');
// console.log("Loading keys " + process.env.SPOTIFY_ID + " : " + process.env.SPOTIFY_SECRET);
exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};