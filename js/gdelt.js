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