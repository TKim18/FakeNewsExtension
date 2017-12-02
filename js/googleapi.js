var request = require('request');
var fs = require('fs');
var requestSync  = require('sync-request');
var APIKEY = 'AIzaSyBmTwDI9UG_W40YXphzCK8fz1CuvNbz5h0'
var gdelt = 'https://api.gdeltproject.org/api/v2/doc/doc?query=(%22islamic%20state%22%20OR%20isis%20OR%20daesh)&mode=artlist&maxrecords=100&timespan=1week&format=json'

// request('http://www.google.com', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });

function queryGDELT(query) {
  var gdelt = 'https://api.gdeltproject.org/api/v2/doc/doc?query='+query+'&mode=artlist&maxrecords=10&timespan=1week&format=json'
  console.log(gdelt)
  request(gdelt, function (err, res, body) {
    if (res && res.statusCode) {
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

  })
}


function getArticlesfromGDELT(url) {
	var apikey = 'wJQ6DDdVVYv51A6FVlVWHbDrv1dG3ksaBt2NECZn'
	var mercuryGET = "https://mercury.postlight.com/parser?url="+url
	console.log('GET URLLLLLLLL' + mercuryGET)
	var response = requestSync('GET', 
		mercuryGET, {'headers': {'x-api-key': apikey,
								'content-type': 'application/json',
								'user-agent' : 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'}
					})
	console.log(JSON.parse(response.getBody('utf8')).content)
}

function getEntities(query) {
	var requestpayload = {
						  "document":{
						    "type":"PLAIN_TEXT",
						    "language": "EN",
						    "content":query
						  },
						  "encodingType":"UTF8"
						}
	request({url: 'https://language.googleapis.com/v1/documents:analyzeEntities?key='+APIKEY,
			 method: "POST",
			 json: requestpayload
			}, function (err, res, body) {
		
			    if (res && res.statusCode) {
			    	var wstream = fs.createWriteStream('myOutput.txt');
					wstream.write(body);
					wstream.end();
			      	console.log(body)

    		}
  })
	
}


getEntities(`The State Department and President Trump have maintained a united front in the face of reports that Secretary of State Rex Tillerson is on his way out.
Tillerson is the subject of several reports claiming he is to be replaced by CIA Director Mike Pompeo. Sen. Tom Cotton (R-AR) has been floated as a candidate to replace Pompeo in an administration double-switch. Tillerson himself called the reports “laughable” Friday when asked by CNN.

In her press conference Thursday, State Department spokeswoman Heather Nauert fended off reporters’ questions about Tillerson’s future. She referenced a statement from the White House denying reports of his ouster:

You saw the White House statement earlier today. The White House statement confirmed that there will be no personnel changes. It is a fact that Secretary Tillerson serves at the pleasure of the president, as we all do, as does every political appointee and Cabinet member. Secretary Tillerson enjoys this job.

On Friday, Trump backed up the earlier White House statement with a tweet claiming the reports were “fake news.”

Nauert repeatedly tried to turn talk back to the State Department’s policy goals, but the press were persistent in asking about Tillerson’s future. “The reason I’m telling you about sort of all these comings and goings of the secretary is that he remains, as I have been told, committed to doing this job. He does serve at the pleasure of the president. This is a job that he enjoys,” she related.

Asked if Tillerson felt as though he were under pressure, Nauert responded:

I think what he feels is that Washington can be a tough game of politics. You have heard him reference that before, that he’s not from Washington, he’s not a person of Washington, and he doesn’t always understand and accept exactly how Washington works with anonymous sources, things of that nature. That’s not who he is. That’s not the world that he comes from, okay?

Much of the controversy over Tillerson’s future focuses on two administration figures: White House chief of staff John Kelly and Jared Kushner, White House senior adviser. Kelly, CNN claimed Friday, has turned on Tillerson and is now advising the president to drop him. CNN’s source alleges that the turning point was the public revelation that Tillerson called the president a “moron” at a closed-door meeting. Kelly had once been a strong Tillerson supporter.

Nauert pushed back on this suggestion Thursday. Before the CNN report, she told reporters Kelly and Tillerson had seen each other at the White House that morning, but she declined to provide details beyond saying, “I was told that it was normal, the same as usual, that the secretary was treated the same as he always is.”

Kushner’s attitude towards Tillerson is also the subject of several reports. The Washington Examiner cited a source saying he and his wife, fellow White House adviser Ivanka Trump, had turned against the secretary of state after he refused to send a senior State Department delegation to accompany Ivanka on her trip to India.

These reports got a boost Friday as Bloomberg reported that Kushner was actively trying to exclude Tillerson from his plans for negotiations in the Middle East.

This is also not the first round of speculation about Tillerson’s future. In early October, after the “moron” remark was reported, Tillerson denied that Vice President Mike Pence had to “intervene” to keep Tillerson from resigning then.`)

// function performOnce() {

// 	var apikey = 'wJQ6DDdVVYv51A6FVlVWHbDrv1dG3ksaBt2NECZn'
// 	var location = window.location.href
// 	var xhr = new XMLHttpRequest();

// 	console.log(location)

// 	xhr.open("GET", "https://mercury.postlight.com/parser?url="+location, true);
// 	xhr.setRequestHeader("x-api-key", apikey);
// 	xhr.send(null)

// 	console.log(xhr)

// 	xhr.onreadystatechange=function()
// 	{
// 	    //alert("xhr status : "+xmlhttp.readyState);
// 	    var result = xhr.response;

// 		console.log("HELLOOOOO\n\n\n\n\n\n\n\n\n")

// 		//console.log(result.content)
// 		console.log(JSON.parse(result))
// 	}

// }








// queryGDELT('Timothy%20Kim') 	

// queryGDELT('Donald Trump')
