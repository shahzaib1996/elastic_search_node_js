var express = require('express');
var router = express.Router();

var workouts = [
	{
		id: "1",
		type: "weight",
		day: "02/05/2019"
	},
	{
		id: "2",
		type: "height",
		day: "02/05/2019"
	}
]

router.use( (req, res, next) => {
	console.log(req.method, req.url);
	next();
} )

router.get( '/workouts', (req, res) =>{
	return res.status(200).send({
		message: "Get workouts call",
		workouts: workouts
	})
} )

router.get( '/workout/:id', (req, res ) => {
	return res.status(200).send({
		message: "GET REQUEST",
		workouts: "THIS IS NOT"
	})
} )

module.exports = router; 