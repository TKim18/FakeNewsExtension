// Copyright (C) 2017  Tee Tee Kim <fakenews@ttkim.org>

// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// LOGIC!!

//callMercury();
queryGDELT('Timothy%20Kardashian') ;

callMercury();

function callMercury() {

    var apikey = 'wJQ6DDdVVYv51A6FVlVWHbDrv1dG3ksaBt2NECZn'
    var location = window.location.href
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://mercury.postlight.com/parser?url="+location, true);
    xhr.setRequestHeader("x-api-key", apikey);
    xhr.send(null)

    xhr.onreadystatechange=function()
    {
        var result = xhr.response;

        var jsonResult = JSON.parse(result);
        var title = jsonResult.title;
        var contentHTML = jsonResult.content;

        //console.log(jsonResult)
        //console.log(jsonResult.content)

        var el = document.createElement( 'html' );
        el.innerHTML = contentHTML;
        el.getElementsByTagName('a');

        console.log(el);

        var rootNode = el;
        var htmlQ = [rootNode];

        while (htmlQ.length > 0) {
            var node = htmlQ.shift();

            if (node.nodeName.toLowerCase() === 'div' && node.children.length > 2) {
                if (node.id != "") {
                    changeById(node.id);
                } else if (node.className != "") {
                    changeByClassName(node.className);
                } else {
                    changeByDank(node);
                }
            } else {
                htmlQ.push.apply(htmlQ, node.children)
            }
        }
    }
}

function changeById(nodeid) {
    var contentDiv = document.getElementById(nodeid);
    contentDiv.innerHTML = '';
}

function changeByClassName(nodeclass) {
    var contentDivs = document.getElementsByClassName(nodeclass);
    for (var i = 0; i < contentDivs.length; i++) {
        contentDivs[i].innerHTML = '';
    }
}

function changeByDank(node) {
    var searchText = node.innerHTML.slice(0,50);
    var content = document.getElementsByTagName("*");
    for (var i = 0; i < content.length; i++) {
        if (content[i].innerHTML.slice(0,50) == searchText) {
            content[i].parentNode.innerHTML = '';
        }
    }
}

function queryGDELT(query) {
  var APIKEY = 'AIzaSyBmTwDI9UG_W40YXphzCK8fz1CuvNbz5h0'
  var gdelt = 'https://api.gdeltproject.org/api/v2/doc/doc?query='+query+'&mode=artlist&maxrecords=10&timespan=1week&format=json'
  console.log(gdelt)
  
  var xhr = new XMLHttpRequest();
  
  xhr.open("GET", gdelt,true);
  xhr.setRequestHeader("x-api-key",APIKEY)
  
  
  xhr.onreadstatechange=function()
  {
      var response = JSON.parse(body)
      var articles = response.articles
      articles.map(function(curr, ind, arr) {
      	console.log(curr.title)
      	console.log(curr.url)
      	console.log(curr.domain)
      	console.log(curr.seendate)
      	getArticlesfromGDELT(curr.url)
      })
    }
  xhr.send()
}

// function walk(node) 
// {
//  // I stole this function from here:
//  // http://is.gd/mwZp7E
//  // Which I stole from here:
//  // https://github.com/panicsteve/cloud-to-butt/blob/master/Source/content_script.js
//  var child, next;
//  switch ( node.nodeType )
//  {
//      case 1:  // Element
//      case 9:  // Document
//      case 11: // Document fragment
//          child = node.firstChild;
//              while ( child ) 
//              {
//                  next = child.nextSibling;
//                  walk(child);
//                  child = next;
//              }
//          break;
//      case 3: // Text node
//          deBullshit(node);
//          break;
//      }
// }

// function deBullshit(textNode) 
// {
//  // Hi, I hope you like slow browsing experiences.
//  textNode.nodeValue = textNode.nodeValue.
//      replace(/\bsynergy\b/gi, "BULLSHIT").
//      replace(/\bthink outside the box\b/gi, "MAKE SHIT UP").
//      replace(/\benterprise\b/gi, "OLD FART").
//      replace(/\bdata scientist\b/gi, "NECK BEARD").
//      replace(/\bbig data\b/gi, "THE BIG D").
//      replace(/\bthe cloud\b/gi, "THAT NEWFANGLED DATA STORE").
//      replace(/\bincrease roi\b/gi, "SPEND MORE MONEY").
//      replace(/\bclient[- ]centric\b/gi, "IDIOT PROOF").
//      replace(/\banalytics\b/gi, "STALKING COOKIES").
//      replace(/\binvested\b/gi, "PISSED AWAY").
//      replace(/\bdisruptive technology\b/gi, "NEW SHIT FROM TECH HIPSTERS").
//      replace(/\bcontent marketing\b/gi, "SEO FARMING").
//      replace(/\bmind map\b/gi, "BRAIN DIARRHEA").
//      replace(/\bseed funding\b/gi, "BLOOD MONEY").
//      replace(/\bweb scale\b/gi, "FRIGGIN HUGE");
// }
