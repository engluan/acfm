var myStuff = require('./workshop_database.js')

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
//addMusic (usr_id, play_nm, music_name, artist, album, genre, cover);
myStuff.getMusics (usr_id, play_nm);