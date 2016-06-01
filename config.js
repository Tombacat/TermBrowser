//Edit these to your liking
var host = '192.168.0.141';
//Do not add https or the url path, this is taken care of
var port = 9445;
//Use the https port and not the http port
var user = 'isadmin';
//Use a generic user id
var pass = 'password';
//Type in the password as is, no secure formatting
//Edit these to your liking

// Do not edit these
var get  = 'GET';
var post = 'POST';
// Do not edit these

function setHost() {
  return host;
}

function setPort() {
  return port;
}

function setUser() {
  return user;
}

function setPass() {
  return pass;
}

function setGet() {
  return get;
}

function setPost() {
  return post;
}

exports.setHost = setHost;
exports.setPort = setPort;
exports.setUser = setUser;
exports.setPass = setPass;
exports.setGet = setGet;
exports.setPost = setPost;
