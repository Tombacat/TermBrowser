var htmlprocessor = require("./htmlprocessor");

function route(handle, pathname, response, postData) {
  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, postData);
  } else {
    console.log("No request handler found for " + pathname);
    var body = 'You tried to find a page that we did not implement yet';
    var title = 'Page not found';
    htmlprocessor.createBody(title, body, response);
  }
}

exports.route = route;
