process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var https = require('https');
var querystring = require("querystring");
var htmlprocessor = require("./htmlprocessor");
var config = require("./config");

function getList(response, postData) {
  var parsed_d;
  if(postData.length <= 5 ){
    console.log('No postdata received');
    var body = htmlprocessor.createListForm();
    var title = 'Please fill in a search text';
    htmlprocessor.createBody(title, body, response);
  } else {
    var headers = {
      'Accept': 'application/json',
      'Accept-Encoding': 'identity'
    }

    var path = '/ibm/iis/igc-rest/v1/search?types=term&text=' + querystring.parse(postData).text + '&search-properties=name';

    console.log('Searching for:');
    console.log(querystring.parse(postData).text);

    var optionsget = {
      host : config.setHost(),
      port : config.setPort(),
      //path : '/ibm/iis/igc-rest/v1/search?types=term&pageSize=10',
      //path : '/ibm/iis/igc-rest/v1/search/term',
      path : path,
      method : config.setGet(),
      auth : config.setUser() + ':' + config.setPass(),
      headers : headers
    };

    console.log('Options prepared:');
    console.log(optionsget);

    var reqGet = https.request(optionsget, function(res) {
      //console.log("statusCode: ", res.statusCode);
      res.on('data', function(d) {
        parsed_d = JSON.parse(d)["items"];
      });

      res.on('end', function() {
        console.log('Results are:');
        console.log(JSON.stringify(parsed_d));
        var body = '';
        var title = '';

        if(parsed_d.length <= 0){
          title = 'Please fill in an other search text, no data found';
          var body = htmlprocessor.createListForm();
        } else {
          title = 'Terms found';
          body = '<form action="/term" method="post"><div align="left"><br><table>';
          for (var i=0; i<parsed_d.length; i++){
            //body = body + parsed_d[i]["_name"] + ' ' + parsed_d[i]["_id"] + '</br>';
            body = body + '<tr><td><input type="radio" name="all" value="' + parsed_d[i]["_id"] + '"></td><td>' + parsed_d[i]["_name"] + '</td><td>';
            for (var j=0; j<parsed_d[i]["_context"].length; j++){
              if(parsed_d[i]["_context"][j]["_type"] === 'category'){
                //body = body + parsed_d[i]["_context"][j]["_name"] + ' ' + parsed_d[i]["_context"][j]["_id"] + ' -> ';
                body = body + parsed_d[i]["_context"][j]["_name"] + ' -> ';
              }
            }
            var last_arrow = body.lastIndexOf(' -> ');
            if (last_arrow != -1) {
              body = body.substr(0, last_arrow) + body.substr(last_arrow + 4);
            }
            body = body + '</td></tr>';
          }
          body = body + '</table><br><input type="submit" value="Select term" />' + '</div></form>';
        }
        htmlprocessor.createBody(title, body, response);
      });

      reqGet.on('error', function(e) {
        console.log('Error:',e);
        var body = '<b>Error stack: </b>' + e.stack;
        var title = 'Error encountered: ' + e.message;
        htmlprocessor.createBody(title, body, response);
      });
    });
    reqGet.end();
  };
}

exports.getList = getList;
