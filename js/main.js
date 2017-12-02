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
	    //alert("xhr status : "+xmlhttp.readyState);
	    var result = xhr.response;

		console.log("HELLOOOOO\n\n\n\n\n\n\n\n\n")

		//console.log(result.content)
		var jsonResult = JSON.parse(result);
		var title = jsonResult.title;
		var contentHTML = jsonResult.content;
		
		var el = document.createElement( 'html' );
		el.innerHTML = contentHTML;
		el.getElementsByTagName('a');

		var rootNode = el;
		var htmlQ = [rootNode];

		console.log(el);

		while (htmlQ.length > 0) {
			var node = htmlQ.shift();

			if (node.nodeName.toLowerCase() === 'div' && node.children.length > 2) {
				var searchText = node.innerHTML.slice(0,100);
				search(searchText);
				// console.log("This is the layer we need to remove right here:" + node.className);
				// console.log("Or we can use the div's id:" + node.id);
				// if (node.className == "") {
				// 	return changeById(node.id);
				// } else {
				// 	return changeByClassName(node.className);
				// }
				// node.innerHTML = '';
				// // while(node.firstChild) {
				// // 	node.removeChild(node.firstChild)
				// // }
				// break;
			}
			htmlQ.push.apply(htmlQ, node.children)
		}
	}
}

function search(searchText) {
	var divs = document.getElementsByTagName('div');
	console.log(searchText)
	for (var i = 0; i < divs.length; i++) {
		console.log(divs[i]);
		console.log("YOO: " + divs[i].innerHTML.slice(0,100));
		if (divs[i].innerHTML.slice(0,100) == searchText) {
			console.log("WE FOUND IT BOIS: ")
		}
	}
}

function changeById(nodeid) {
	console.log("Our tag we should search by is: " + nodeid);
	var contentDiv = document.getElementById(nodeid);
	console.log("Now that we here: " + contentDiv.innerHTML);
	contentDiv.innerHTML = '';
}

function changeByClassName(nodeclass) {
	console.log("Our class name is: " + nodeclass);
	//var contentDiv = document.get
}


// function walk(node) 
// {
// 	// I stole this function from here:
// 	// http://is.gd/mwZp7E
// 	// Which I stole from here:
// 	// https://github.com/panicsteve/cloud-to-butt/blob/master/Source/content_script.js
// 	var child, next;
// 	switch ( node.nodeType )
// 	{
// 		case 1:  // Element
// 		case 9:  // Document
// 		case 11: // Document fragment
// 			child = node.firstChild;
// 				while ( child ) 
// 				{
// 					next = child.nextSibling;
// 					walk(child);
// 					child = next;
// 				}
// 			break;
// 		case 3: // Text node
// 			deBullshit(node);
// 			break;
// 		}
// }

// function deBullshit(textNode) 
// {
// 	// Hi, I hope you like slow browsing experiences.
// 	textNode.nodeValue = textNode.nodeValue.
// 		replace(/\bsynergy\b/gi, "BULLSHIT").
// 		replace(/\bthink outside the box\b/gi, "MAKE SHIT UP").
// 		replace(/\benterprise\b/gi, "OLD FART").
// 		replace(/\bdata scientist\b/gi, "NECK BEARD").
// 		replace(/\bbig data\b/gi, "THE BIG D").
// 		replace(/\bthe cloud\b/gi, "THAT NEWFANGLED DATA STORE").
// 		replace(/\bincrease roi\b/gi, "SPEND MORE MONEY").
// 		replace(/\bclient[- ]centric\b/gi, "IDIOT PROOF").
// 		replace(/\banalytics\b/gi, "STALKING COOKIES").
// 		replace(/\binvested\b/gi, "PISSED AWAY").
// 		replace(/\bdisruptive technology\b/gi, "NEW SHIT FROM TECH HIPSTERS").
// 		replace(/\bcontent marketing\b/gi, "SEO FARMING").
// 		replace(/\bmind map\b/gi, "BRAIN DIARRHEA").
// 		replace(/\bseed funding\b/gi, "BLOOD MONEY").
// 		replace(/\bweb scale\b/gi, "FRIGGIN HUGE");
// }
