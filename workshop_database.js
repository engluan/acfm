var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
 * define our structures and defines
 */

var INVALID_VALUE = -1

var SRV_URL = 'mongodb://localhost/';
var DATABASE = 'workshop';

var NAME = 'name'
var ARTIST = 'artist'
var ALBUM = 'album'
var GENRE = 'genre'
var COVER = 'cover'

var MUSICS = 'musics'

var NAME = 'name'
var PASS = 'pass'
var PLAYLISTS = 'playlists'

var IDENTIFIER = 'identifier'

var Music = new Schema({
	name: String,
	artist: String,
	album: String,
	genre: String,
	cover: String});

var Playlist = new Schema({
	name: String,
	identifier: {type: String, index: {unique: true}},
	musics: [Music]});

var User = new Schema({
	_id: Number,
	name: String,
	pass: String,
	playlists: [Playlist]});

/* create our constructor */
var User = mongoose.model('User', User);
var Playlist = mongoose.model('Playlist', Playlist);
var Music = mongoose.model('Music', Music);

function generatePlaylistId (usr_id, playlist_name){
	return usr_id + playlist_name;
}


/*
 * define our methods
 */

/* disconnect form the server*/
function closeDb (db) {
	db.close();
}

/* this will register one new user*/
function userRegistration (usr_id, usr_name, usr_pass){

	/* connect to our local server */
	mongoose.connect(SRV_URL + DATABASE);

	/* instantiate our connection */
	var db = mongoose.connection;

	/* create our new user*/
	var user = new User({
	_id: usr_id,
	name: usr_name,
	pass: usr_pass,
	playlists: []});

	/* save our user*/
	user.save(function (err, data) {
		if (err) console.log(err);
		else console.log('\nSaved : ', data);
			closeDb(db);
	});
}

/* this will check one user login*/
function checkLogin (usr_name, pass){

	/* this var will be used to save our info*/
	var info = INVALID_VALUE;

	/* connect to our local server */
	mongoose.connect(SRV_URL + DATABASE);

	/* instantiate our connection */
	var db = mongoose.connection;

	/* get one person with this user name*/
	User.findOne({name : usr_name}, PASS, 
		function (err, data) {
		if (err) console.log(err);
		else { 
			console.log('\nRecovered : ', data);
			closeDb(db);
			if (data == null || data[PASS] != pass) info = null;
			else info = data['_id']; /* we just need this user id to continue*/
			
			/* TODO: Reply our server*/
			console.log(info)
		}
	});
}

/* this will retrieve all the playlists name*/
function getPlaylists (usr_id){

	/* connect to our local server */
	mongoose.connect(SRV_URL + DATABASE);

	/* instantiate our connection */
	var db = mongoose.connection;

	/* get one person with this user id*/
	User.findOne({_id : usr_id}, PLAYLISTS, 
		function (err, data) {
		if (err) console.log(err);
		else { 
			console.log('\nRecovered : ', data);
			data = data[PLAYLISTS]; /* we just need their playlist*/
			closeDb(db);
			
			/* TODO: Reply our server*/
		}
	});
}

/* this will add a new playlist to a user*/
function createPlaylist (usr_id, playlist_name){

	/* connect to our local server */
	mongoose.connect(SRV_URL + DATABASE);

	/* instantiate our connection */
	var db = mongoose.connection;

	/* create our playlist*/
	var playL = new Playlist({
	name: playlist_name,
	identifier: generatePlaylistId(usr_id,playlist_name),
	musics: []});

	/* save our playlist*/
	playL.save(function (err, data) {
		if (err) console.log(err);
		else console.log('\nSaved : ', data);

			/* now lets add this info to the user*/
			User.update({_id : usr_id}, {$addToSet: {'playlists': data}}, 
					function (err, user) {
					if (err) console.log(err);
					closeDb(db);
			});
	});
}

/* this will add a new music to our playlist*/
function addMusic (usr_id, playlist_name, music_name, artist, album, genre, cover=null){

	/* connect to our local server */
	mongoose.connect(SRV_URL + DATABASE);

	/* instantiate our connection */
	var db = mongoose.connection;

	/* create our music*/
	var newMusic = new Music({
	name: music_name,
	artist: artist,
	album: album,
	genre: genre,
	cover: cover});

	/* save our music*/
	newMusic.save(function (err, data) {
		if (err) console.log(err);
		else console.log('\nSaved : ', data);

			/* now lets add this info to the playlist*/
			Playlist.update({identifier: generatePlaylistId(usr_id, playlist_name)}, {$addToSet: {'musics': data}}, 
					function (err, user) {
					if (err) console.log(err);
					closeDb(db);
			});
	});
}

function getMusics (usr_id, playlist_name){

	/* connect to our local server */
	mongoose.connect(SRV_URL + DATABASE);

	/* instantiate our connection */
	var db = mongoose.connection;

	/* get our playlist*/
	Playlist.findOne({identifier: generatePlaylistId(usr_id, playlist_name)}, MUSICS, 
		function (err, data) {
		if (err) console.log(err);
		else { 
			console.log('\nRecovered : ', data);
			data = data[MUSICS]; /* we just need their playlist*/
			closeDb(db);
			
			/* TODO: Reply our server*/
		}
	});	
}


/*
 * our main code
 */

var usr_id = 1;
var usr_nm = 'jao';
var usr_pass = '123';
var play_nm = 'first playlist';

var music_name = 'mname';
var artist = 'martist'
var album = 'malbum';
var genre = 'mgenre';
var cover = 'mcover';

//userRegistration(usr_id, usr_nm, usr_pass);
//checkLogin(usr_nm, usr_pass);
//createPlaylist(usr_id, play_nm)
//getPlaylists(usr_id)
addMusic (usr_id, play_nm, music_name, artist, album, genre, cover);
//getMusics (usr_id, play_nm);