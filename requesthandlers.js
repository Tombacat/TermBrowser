var termList = require("./termlist");
var htmlprocessor = require("./htmlprocessor");

function search(response, postData) {
  console.log("Request handler search was called");
  var body = htmlprocessor.createListForm();
  var title = 'Search for a term';
  htmlprocessor.createBody(title, body, response);
}

function list(response, postData) {
  console.log("Request handler list was called");
  termList.getList(response, postData);
}

function term(response, postData) {
  console.log("Request handler term was called");
  var title = 'Received selection';
  var body = 'RID: ' + postData;
  htmlprocessor.createBody(title, body, response);
}

exports.list = list;
exports.term = term;
exports.search=search;
