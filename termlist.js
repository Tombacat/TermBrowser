process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var https = require('https');
var querystring = require("querystring");
var htmlprocessor = require("./htmlprocessor");
var config = require("./config");

function getList(response, postData) {
  var parsed_d;
  if(postData.length <= 5 ){
    console.log('No postdata received (getList)');
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

        if(typeof parsed_d === 'undefined') {
          console.log('Something went wrong (getTerm)');
          var body = htmlprocessor.createListForm();
          var title = 'Please fill in a search text';
          htmlprocessor.createBody(title, body, response);
        } else {
          if(parsed_d.length <= 0){
            title = 'Please fill in an other search text, no data found';
            var body = htmlprocessor.createListForm();
          } else {
            title = 'Terms found';
            body = '<form action="/term" method="post"><div align="left"><br><table><tr><td></td><td><h4>Term</h4></td><td><h4>Category</h4></td></tr>';
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
            body = body + '</table><br><input type="submit" value="Select term" /></div></form>';
          }
          htmlprocessor.createBody(title, body, response);
        }
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

function getTerm(response, postData) {
  var parsed_d;
  if(postData.length <= 4 ) {
    console.log('No postdata received (getTerm)');
    var body = htmlprocessor.createListForm();
    var title = 'No term selected';
    htmlprocessor.createBody(title, body, response);
  } else {
    var headers = {
      'Accept': 'application/json',
      'Accept-Encoding': 'identity'
    }

    var parsed_postData = postData.substr(4);
    var path = '/ibm/iis/igc-rest/v1/assets/' + parsed_postData;

    console.log('Searching for:');
    console.log(parsed_postData);

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
        parsed_d = JSON.parse(d);
      });

      res.on('end', function() {
        console.log('Results are:');
        console.log(JSON.stringify(parsed_d));
        var body = '';
        var title = '';
        var date;
        var data_found;

        if(typeof parsed_d === 'undefined') {
          console.log('Something went wrong (getTerm)');
          var body = htmlprocessor.createListForm();
          var title = 'Please fill in a search text';
          htmlprocessor.createBody(title, body, response);
        } else {
          if(parsed_d.length <= 0) {
            title = 'Please fill in an other search text, no data found';
            var body = htmlprocessor.createListForm();
          } else {
            data_found = 0;
            title = parsed_d["_name"];
            body = '<h4>Short description</h4>' + parsed_d["short_description"] + '<br><br>';
            body = body + '<table><tr><td><h4>Created by</h4></td><td><h4>Created on</h4></td></tr>';
            date = new Date(parsed_d["created_on"]);
            body = body + '<tr><td>' + parsed_d["created_by"] + '</td><td>' + date + '</td></tr>';
            body = body + '<tr><td><h4>Modified by</h4></td><td><h4>Modified on</h4></td></tr>';
            date = new Date(parsed_d["modified_on"]);
            body = body + '<tr><td>' + parsed_d["modified_by"] + '</td><td>' + date + '</td></tr>';;
            body = body + '<tr><td><h4>Status</h4></td><td><h4>Category</h4></td></tr>';
            body = body + '<tr><td>' + parsed_d["status"] + '</td><td>';
            for (var i=0; i<parsed_d["_context"].length; i++){
              if(parsed_d["_context"][i]["_type"] === 'category'){
                //body = body + parsed_d[i]["_context"][j]["_name"] + ' ' + parsed_d[i]["_context"][j]["_id"] + ' -> ';
                body = body + parsed_d["_context"][i]["_name"] + ' -> ';
              }
            }
            var last_arrow = body.lastIndexOf(' -> ');
            if (last_arrow != -1) {
              body = body.substr(0, last_arrow) + body.substr(last_arrow + 4);
            }
            body = body + '</td></tr></table>';
            body = body + '<h4>History</h4>';
            for (var i=0; i<parsed_d["history"]["items"].length; i++){
              date = new Date(parsed_d["history"]["items"][i]["date"]);
              body = body + 'Changed by: ' + parsed_d["history"]["items"][i]["editedBy"] + ', on: ' + date + ', comment: ' + parsed_d["history"]["items"][i]["comment"] + '<br>';
            }
            body = body + '<br><form action="/formaction" method="post"><div align="left"><br><table>';
            if(typeof parsed_d["is_a_type_of"] !== 'undefined') {
              body = body + '<tr><td><h4>Is a type of</h4></td></tr>';
              for (var i=0; i<parsed_d["is_a_type_of"]["items"].length; i++) {
                body = body + '<tr><td><input type="radio" name="all" value="' + parsed_d["is_a_type_of"]["items"][i]["_id"] + '"></td><td>' + parsed_d["is_a_type_of"]["items"][i]["_name"] + '</td></tr>';
                data_found = data_found + 1;
              }
            }
            if(typeof parsed_d["has_types"] !== 'undefined') {
              body = body + '<tr><td><h4>Has types</h4></td></tr>';
              for (var i=0; i<parsed_d["has_types"]["items"].length; i++) {
                body = body + '<tr><td><input type="radio" name="all" value="' + parsed_d["has_types"]["items"][i]["_id"] + '"></td><td>' + parsed_d["has_types"]["items"][i]["_name"] + '</td></tr>';
                data_found = data_found + 1;
              }
            }
            if(typeof parsed_d["is_of"] !== 'undefined') {
              body = body + '<tr><td><h4>Is of</h4></td></tr>';
              for (var i=0; i<parsed_d["is_of"]["items"].length; i++) {
                body = body + '<tr><td><input type="radio" name="all" value="' + parsed_d["is_of"]["items"][i]["_id"] + '"></td><td>' + parsed_d["is_of"]["items"][i]["_name"] + '</td></tr>';
                data_found = data_found + 1;
              }
            }
            if(typeof parsed_d["has_a"] !== 'undefined') {
              body = body + '<tr><td><h4>Has a</h4></td></tr>';
              for (var i=0; i<parsed_d["has_a"]["items"].length; i++) {
                body = body + '<tr><td><input type="radio" name="all" value="' + parsed_d["has_a"]["items"][i]["_id"] + '"></td><td>' + parsed_d["has_a"]["items"][i]["_name"] + '</td></tr>';
                data_found = data_found + 1;
              }
            }
            if(typeof parsed_d["synonyms"] !== 'undefined') {
              body = body + '<tr><td><h4>Synonyms</h4></td></tr>';
              for (var i=0; i<parsed_d["synonyms"]["items"].length; i++) {
                body = body + '<tr><td><input type="radio" name="all" value="' + parsed_d["synonyms"]["items"][i]["_id"] + '"></td><td>' + parsed_d["synonyms"]["items"][i]["_name"] + '</td></tr>';
                data_found = data_found + 1;
              }
            }
            if(typeof parsed_d["preferred_synonym"] !== 'undefined') {
              body = body + '<tr><td><h4>Preferred synonym</h4></td></tr>';
              body = body + '<tr><td><input type="radio" name="all" value="' + parsed_d["preferred_synonym"]["_id"] + '"></td><td>' + parsed_d["preferred_synonym"]["_name"] + '</td></tr>';
              data_found = data_found + 1;
            }
            if(typeof parsed_d["related_terms"] !== 'undefined') {
              body = body + '<tr><td><h4>Related terms</h4></td></tr>';
              for (var i=0; i<parsed_d["related_terms"]["items"].length; i++) {
                body = body + '<tr><td><input type="radio" name="all" value="' + parsed_d["related_terms"]["items"][i]["_id"] + '"></td><td>' + parsed_d["related_terms"]["items"][i]["_name"] + '</td></tr>';
                data_found = data_found + 1;
              }
            }
            if(typeof parsed_d["replaces"] !== 'undefined') {
              body = body + '<tr><td><h4>Replaces</h4></td></tr>';
              for (var i=0; i<parsed_d["replaces"]["items"].length; i++) {
                body = body + '<tr><td><input type="radio" name="all" value="' + parsed_d["replaces"]["items"][i]["_id"] + '"></td><td>' + parsed_d["replaces"]["items"][i]["_name"] + '</td></tr>';
                data_found = data_found + 1;
              }
            }
            if(typeof parsed_d["replaced_by"] !== 'undefined') {
              body = body + '<tr><td><h4>Replaced by</h4></td></tr>';
              body = body + '<tr><td><input type="radio" name="all" value="' + parsed_d["replaced_by"]["_id"] + '"></td><td>' + parsed_d["replaced_by"]["_name"] + '</td></tr>';
              data_found = data_found + 1;
            }
            if(typeof parsed_d["assigned_terms"] !== 'undefined') {
              body = body + '<tr><td><h4>Assigned terms</h4></td></tr>';
              for (var i=0; i<parsed_d["assigned_terms"]["items"].length; i++) {
                body = body + '<tr><td><input type="radio" name="all" value="' + parsed_d["assigned_terms"]["items"][i]["_id"] + '"></td><td>' + parsed_d["assigned_terms"]["items"][i]["_name"] + '</td></tr>';
                data_found = data_found + 1;
              }
            }
            if(typeof parsed_d["assigned_to_terms"] !== 'undefined') {
              body = body + '<tr><td><h4>Assigned to terms</h4></td></tr>';
              for (var i=0; i<parsed_d["assigned_to_terms"]["items"].length; i++) {
                body = body + '<tr><td><input type="radio" name="all" value="' + parsed_d["assigned_to_terms"]["items"][i]["_id"] + '"></td><td>' + parsed_d["assigned_to_terms"]["items"][i]["_name"] + '</td></tr>';
                data_found = data_found + 1;
              }
            }

            if(data_found > 0) {
              body = body + '</table><br><input type="submit" value="Select term" /></div></form>';
              body = body.replace('formaction','term');
            } else {
              body = body + '</table><br><input type="submit" value="New search" /></div></form>';
              body = body.replace('formaction','search');
            }
          }
          htmlprocessor.createBody(title, body, response);
        }
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
exports.getTerm = getTerm;
