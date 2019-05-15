# liri
A command line based program running under node.js Takes a command, then the rest of the arguments make up a string that the command processes. The program will search imdb, spotify or bandsintown to get the information

#### Technologies and node modules
* javascript
* GitHub
* dotenv
* keys
* node-spotify-api
* moment
* axios
* sprintf-js (string formatter)
* chalk (adds colors to console output)

#### Github repository
<https://github.com/johnlobster/liri.git>

#### Deploying
clone the master repo

spotify API needs to have environment variables

create a `.env` file (not tracked by git) and add the following
```
# Spotify API keys

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret
```
liri can then be run using node, for example
```
node liri movie-this The good the bad and the ugly
```

liri has a help function, type
```
node liri help
```

#### Results
Results can be found in the results sub-directory. 
`results/README.txt` has details

#### Design notes

The main issues with this program came from the APIs

* spotify API

  I used `node-spotify-api` which provides a wrapper for the http request. The request searches for the track/song name that you specify, but it is a general search - many songs with the search specified show up and the exact match does not appear at the front of the list. I had to search the list of tracks returned for an exact match to the track name. The API only returns a maximum of 40 results and does not have the ability to offset the search, so it is possible that the search won't find the exact track match and further searches cannot be made.
* bandtown API

  For finding concerts, the only available search term is for the band name and an optional date range. This means that worldwide concerts are returned. I decided to limit this to concerts only in California, otherwise the list can become very large. I also limited the date range to "upcoming" to avoid concerts that have already played.

Liri logs alll successful queries to the logfile `log.txt`, a sample is available in the results sub-directory






