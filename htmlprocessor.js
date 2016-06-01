function createBody(title, body, response){
  var body_out = '<html>' +
  '<head>' +
  '<meta http-equiv="Content-Type" content="text/html; ' +
  'charset=UTF-8" />' +
  '</head>' +
  '<body>' +
  '<h1>' + title + '</h1>' +
  body +
  '</body>' +
  '</html>';
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(body_out);
  response.end();
}

function createListForm() {
  var body = '<form action="/list" method="post">' +
  '<textarea name="text" rows="1" cols="60"></textarea>' +
  '<input type="submit" value="Search term" />' +
  '</form>';
  return body;
}

exports.createBody = createBody;
exports.createListForm = createListForm;
