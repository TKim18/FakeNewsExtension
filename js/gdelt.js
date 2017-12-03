function queryGDELT(keyword) {
  var header = 'https://api.gdeltproject.org/api/v2/doc/doc?query='
  var ending = ' domain:nytimes.com sourcelang:english&format=JSON'
  var query = header+keyword+ending
  
  var xhr = new XMLHttpRequest();
  
  xhr.open("GET", query,true);
  
  xhr.onreadystatechange=function()
  {
      //console.log(xhr.responseText)
      var response = JSON.parse(xhr.responseText)
      var articles = response.articles
      // possible use random
      console.log(articles[0].url)
//       articles.map(function(curr, ind, arr) {
//       	console.log(curr.title)
//       	console.log(curr.url)
//       	console.log(curr.domain)
//       	console.log(curr.seendate)
//       	getArticlesfromGDELT(curr.url)
//       })
    }
  xhr.send()
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
  console.log(requestpayload)
  var xhr = new XMLHttpRequest();
  
  xhr.open("POST", 'https://language.googleapis.com/v1/documents:analyzeEntitySentiment?key='+APIKEY, true);
  xhr.setRequestHeader('content-type', 'application/json')

  xhr.onreadystatechange=function()
  {
  	var entities = JSON.parse(xhr.responseText).entities.slice(0,5)
  	var result = ""
  	
  	for (var i = 0; i < entities.length; i++) {
  		result = result + entities[i]['name']; + ' '
  	}
  	console.log(result)


  }
  xhr.send(JSON.stringify(requestpayload))
}