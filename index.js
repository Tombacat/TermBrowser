var server = require("./server");
var router = require("./router");
var requesthandlers = require("./requesthandlers");

var handle = {};
handle["/"] = requesthandlers.search;
handle["/search"] = requesthandlers.search;
handle["/list"] = requesthandlers.list;
handle["/term"] = requesthandlers.term;

server.start(router.route,handle);
