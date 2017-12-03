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
        console.log(jsonResult)

        var jsonResultClean = strip(jsonResult.content)

        console.log(jsonResultClean)
        getEntities(jsonResultClean, 10)
    }
}

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
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

        if (response != null) {
            var entities = response.entities
            console.log(entities.length)
            var result = ""
            console.log(entities)
            for (var i = 3; i < limit-3 ; i++) {
                var temp = entities[i]['name'];
                if (temp.length > 4) {
                //if (temp != 'class' && !isURL(temp)) {
                    result = result + '"'+temp+'"' + ' '
                }
            }
            console.log('HERE ARE MY KEYWORDS YO' + result)
            queryGDELT(content, result, limit)
        }
    }
    xhr.send(JSON.stringify(requestpayload))
}

function queryGDELT(content, keyword, limit) {
    console.log(keyword)
    var header = 'https://api.gdeltproject.org/api/v2/doc/doc?query='
    var ending = ' domain:apnews.com sourcelang:english&format=json'
    var query = header+keyword+ending
    console.log(query)
    var xhr = new XMLHttpRequest();

    xhr.open("GET", query, true);

    xhr.onreadystatechange=function()
    {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var response = xhr.response
            var responseJSON = JSON.parse(response)
            console.log(responseJSON)


            if (Object.keys(responseJSON).length == 0 && limit != 1) {
                    console.log('STILL TRYING TO FIND ARTICLE WITH KEYWORD SIZE: ' + limit)
                    getEntities(content, limit-1)
                }
            } 
            if (Object.keys(responseJSON).length > 0) {
                var articles = responseJSON.articles
                console.log('REAL NEWS' + articles[0].url)
                getArticlesfromGDELT(articles[0].url);
            }
        
    }
    xhr.send()
}


function getArticlesfromGDELT(url) {
    var apikey = 'wJQ6DDdVVYv51A6FVlVWHbDrv1dG3ksaBt2NECZn'
    var mercuryGET = "https://mercury.postlight.com/parser?url="+url
    var xhr = new XMLHttpRequest();
  
    xhr.open("GET", mercuryGET, true);
    xhr.setRequestHeader("x-api-key",apikey)
    xhr.setRequestHeader('content-type', 'application/json')
    xhr.onreadystatechange=function()
    {
        var response = xhr.responseText;
        var parsed = JSON.parse(response);
        var content = parsed.content;
        var photo = parsed.lead_image_url

        replaceCurrentBody(content, photo)
    }
    xhr.send()
}


function replaceCurrentBody(content, photo) {
    var apikey = 'wJQ6DDdVVYv51A6FVlVWHbDrv1dG3ksaBt2NECZn'

    var location = window.location.href
    var xhr = new XMLHttpRequest();

    console.log(content)
    xhr.open("GET", "https://mercury.postlight.com/parser?url="+location, true);
    xhr.setRequestHeader("x-api-key", apikey);
    xhr.send(null)

    xhr.onreadystatechange=function()
    {
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var result = xhr.response;
            var jsonResult = JSON.parse(result);

            var title = jsonResult.title;
            var contentHTML = jsonResult.content;
            var currPhoto = jsonResult.lead_image_url;

            //console.log(jsonResult)

            var el = document.createElement( 'html' );
            el.innerHTML = contentHTML;
            el.getElementsByTagName('a');

            var rootNode = el;
            var htmlQ = [rootNode];

            if (currPhoto && photo) {
                deleteImage(currPhoto)
            }

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
    console.log("got class")
    contentDivs[0].innerHTML = content;    
    // for (var i = 0; i < contentDivs.length; i++) {
    //     contentDivs[i].innerHTML = content;
    // }
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

function deleteImage(image) {
    var allImages = document.getElementsByTagName("img");
    for(var i = 0, max = allImages.length; i < max; i++){
        console.log(allImages[i].src)
        if (allImages[i].src.indexOf(image.slice(0,15) != -1)){
           allImages[i].parentNode.removeChild(allImages[i]);
           break;
        }
    }
}

function changeImage(a) {
    document.getElementById("img").src=a;
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