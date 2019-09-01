// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// const request = require('request');
// var routes = require('./routes');

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const uuidv1 = require('uuid/v1');
const app = express()
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
	host: 'localhost:9200'
})

const port = 3000;
 
// app.get('/', function (req, res) {
//   res.send('Hello World')
// })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs')
// app.use( '/api', routes );

app.listen(port, () => console.log('App Listening on port '+port) );

app.get('marksheet',function(req,res){





})

app.get('/start', function(req, res){
		res.status(200).render('index',{results:'',search_str:''});
})

app.get('/insert', function(req, res){
		res.status(200).render('insert',{status: '2'});
})

app.post('/insertdocument', function(req, res){
	var df =  req.body.Docfields;
	console.log(req);
	console.log(req.body.Docfields);

	var docBody = {};

	for(i=0;i<df.length;i++) {
		docBody['d'+(i+1)] = df[i]; 
	}

	console.log(" ES Doc Body ");
	console.log(docBody);

	// res.status(200).send(docBody);

	client.index({
		index: 'mydocument',
		type: 'mytype',
		id: uuidv1(),
		body: docBody
	}, function(err) {
		if( err ) {
			console.log(err);
			res.status(200).render('insert',{status: '0'});
		} else {
			res.status(200).render('insert',{status: '1'});
		}
	});

})

const search = function search(index, body) {
  return client.search({index: index, body: body});
};

app.post('/general_search', function(req, res){

	var search_arr = req.body.search.split(" ");

	// console.log(req.body.search);
	// console.log(search_arr);

	let searchBody = {
		"size" : 10,
  		"query": {
         	"bool": {
            	"should": [
                	// {
                 //   		"multi_match": {
                 //      		"type": "best_fields",
                 //      		"query": "ssss-wwww-ssdd-oo-pppd",
                 //      		"operator": "and"
                 //   		}
                	// },
                	// {
                	// 	"multi_match": {
                 //      		"type": "best_fields",
                 //   			"query": "bbbb-qqqq-rrrr-eeee-ssss",
                 //   			"operator": "and"
                	// 	}
                	// }
  
             	]

          	}
       	}
	};




	// console.log( searchBody['query']['bool']['should'] )

	if(search_arr) {
		for(i=0; i<search_arr.length; i++) {
	      console.log(search_arr[i]);
	      searchBody['query']['bool']['should'].push({
							                		"multi_match": {
							                   			"query": search_arr[i],
							                      		"type": "best_fields",
							                   			"operator": "and"
							                		}
							                	});
	    }
	}

	// searchBody['query']['bool']['should'].push({
	// 						                		"multi_match": {
	// 						                      		"type": "best_fields",
	// 						                   			"query": "shahzaib",
	// 						                   			"operator": "and"
	// 						                		}
	// 						                	});

	// console.log( searchBody );


	// res.send( req.body.search );	


	  // res.send(body);
	  // res.status(200).render('index');

	  search('mydocument', searchBody)
	  .then(results => {
	    console.log(`found ${results.hits.total} items in ${results.took}ms`);
	    console.log(`returned article titles:`);
	    console.log(results);
	    res.render('index', {results:results, search_str:req.body.search} );
	    // res.send(results['hits']['hits'][0]);
	    // results.hits.hits.forEach(
	    //   (hit, index) => console.log(
	    //     `\t${body.from + ++index} - ${hit._source.id}`
	    //   )
	    // )
	  })
	  .catch(console.error);
	

})
 