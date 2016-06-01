# TermBrowser
This is a first node.js application. It can be used to crawl through terms in IBM InfoSphere Governance Catalog v11.5.0.1. 
You will need to care of a IBM InfoSphere Information Server installation as well as a node.js installation.
Download all the files and start with "node index.js" on a command line.

Change "config.js" to your liking (and only the 4 items mentioned):
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
