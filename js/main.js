// Copyright (C) 2017  Tee Tee Kim <fakenews@ttkim.org>

// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

var APIKEY = 'AIzaSyBmTwDI9UG_W40YXphzCK8fz1CuvNbz5h0'

function main() {
    //Any additional setup can go here

    getCurrentArticleBody()
}

function getCurrentArticleBody() {
    var apikey = 'wJQ6DDdVVYv51A6FVlVWHbDrv1dG3ksaBt2NECZn'
    var location = window.location.href
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://mercury.postlight.com/parser?url="+location, true);
    xhr.setRequestHeader("x-api-key", apikey);
    xhr.send(null)

    xhr.onreadystatechange=function() {
        var result = xhr.response;

        var jsonResult = JSON.parse(result);

        getEntities(jsonResult.content, 5)
    }
}

function getEntities(content, limit) {
    var requestpayload = {
        "document":{
            "type": "PLAIN_TEXT",
            "language": "EN",
            "content": content
        },
        "encodingType":"UTF8"
    }
    console.log(requestpayload)
    var xhr = new XMLHttpRequest();
  
    xhr.open("POST", 'https://language.googleapis.com/v1/documents:analyzeEntitySentiment?key='+APIKEY, true);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.responseType = 'json';

    xhr.onreadystatechange=function()
    {
        var response = xhr.response

        //console.log(response)
        if (response != null) {
            var entities = response.entities
            console.log(entities.length)
            var result = ""
            
            // add regex to ensure the entities are safe
            for (var i = 3; i < 15; i++) {
                var temp = entities[i]['name'];
                if (temp != 'class' && !isURL(temp)) {
                    result = result + temp + ' '
                }
            }
            queryGDELT(content, result)
        }
    }
    xhr.send(JSON.stringify(requestpayload))
}

function queryGDELT(content, keyword) {
    console.log(keyword)
    var header = 'https://api.gdeltproject.org/api/v2/doc/doc?query='
    var ending = ' domain:nytimes.com sourcelang:english&format=json'
    var query = header+keyword+ending

    var xhr = new XMLHttpRequest();
  
    xhr.open("GET", query, true);

    xhr.onreadystatechange=function()
    {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var response = xhr.response
            var responseJSON = JSON.parse(response)
            var articles = responseJSON.articles
            
            console.log("MADE IT" + articles.length)

            if (articles.length == 0) {
                getEntities(contents, 4)
            } else {
                replaceCurrentBody(articles[0])
            }
        }
    }
    xhr.send()
}


function replaceCurrentBody(content) {
    var apikey = 'wJQ6DDdVVYv51A6FVlVWHbDrv1dG3ksaBt2NECZn'
    var location = window.location.href
    var xhr = new XMLHttpRequest();

    console.log("MADE IT \n\n\n\n\n\n\n\n")

    xhr.open("GET", "https://mercury.postlight.com/parser?url="+location, true);
    xhr.setRequestHeader("x-api-key", apikey);
    xhr.send(null)

    xhr.onreadystatechange=function()
    {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var result = xhr.response;

            console.log(typeof(result))

            var jsonResult = JSON.parse(result);

            var title = jsonResult.title;
            var contentHTML = jsonResult.content;

            console.log(jsonResult)

            var el = document.createElement( 'html' );
            el.innerHTML = contentHTML;
            el.getElementsByTagName('a');

            console.log(content)

            var rootNode = el;
            var htmlQ = [rootNode];

            while (htmlQ.length > 0) {
                var node = htmlQ.shift();

                if (node.nodeName.toLowerCase() === 'div' && node.children.length > 2) {
                    if (node.id != "") {
                        changeById(node.id, content);
                    } else if (node.className != "") {
                        changeByClassName(node.className, content);
                    } else {
                        changeByDank(node, content);
                    }
                } else {
                    htmlQ.push.apply(htmlQ, node.children)
                }
            }
        }
    }
}

function changeById(nodeid, content) {
    var contentDiv = document.getElementById(nodeid);
    contentDiv.innerHTML = content;
}

function changeByClassName(nodeclass, content) {
    var contentDivs = document.getElementsByClassName(nodeclass);
    for (var i = 0; i < contentDivs.length; i++) {
        contentDivs[i].innerHTML = content;
    }
}

function changeByDank(node, content) {
    var searchText = node.innerHTML.slice(0,50);
    var content = document.getElementsByTagName("*");
    for (var i = 0; i < content.length; i++) {
        if (content[i].innerHTML.slice(0,50) == searchText) {
            content[i].parentNode.innerHTML = content;
        }
    }
}

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

main()
