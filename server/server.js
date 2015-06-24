fs = require('fs')

express = require('express')
_ = require('lodash')
bodyParser = require('body-parser')

config = require('./config.json')
invoiceGenerator = require('../invoice-generator')
persistence = require('../persistence')


var express = require('express')
var app = express()

app.use('/', express.static(__dirname + '/public'));
app.use(bodyParser.json())

saveConfig = function(){
	fs.writeFile(__dirname + '/config.json', JSON.stringify(config))
}

app.get('/generate-invoice/', function(req, res){
	var options = {};

	options.hoursWorked = req.query.hoursWorked || 80
	options.hourlyRate = req.query.hourlyRate || 30
	options.serviceDescription = "Programming"
	options.invoiceNumber = req.query.nextInvoiceNumber || config.nextInvoiceNumber++
	options.date = moment().format('MMM D, YYYY')
	options.period = {
		start: moment().subtract(1,'week').day('friday').format('MMM D, YYYY'),
		end: moment().subtract(2,'week').day('monday').format('MMM D, YYYY')
	}
	options.dueDate = moment().add(10, 'days').format('MMM D, YYYY')
	options.outputStream = res
	options.fileName = options.fileName = 'Invoice_'+moment().format('YYYY-MM-DD')+'.pdf'
	_.defaults(options, config)
	saveConfig()
	// here abyde dArk majik??
	//res.setHeader("content-disposition", "attachment; filename="+options.fileName)
	invoiceGenerator.generateInvoice(options)
})

app.get('/set-next-invoice-number/', function(req, res){
	config.nextInvoiceNumber = req.query.nextInvoiceNumber
	saveConfig()
	res.end()
})

var persistenceActionsToHttpMethods = {
	get:    'GET',
	create: 'PUT',
	set:    'PUT',
	remove: 'DELETE'
}

persistence.initialize().done(function(){
	var tableList = _.without(_.keys(persistence),'initialize')
	app.get('/schema/tables', function(req,res){
		res.json(tableList)
	})
	_.each(tableList, function(tableName){
		var table = persistence[tableName]
		app.get('/schema/tables/'+tableName, function(req,res){
			res.json(table.columns)
		})
		app.get('/'+tableName+'/:id',function(req,res){
			table.get({
				id: req.params.id
			}).done(function(rows){
				res.json(rows[0])
			})
		})
		app.get('/'+tableName,function(req,res){
			table.get(req.body).done(function(rows){
				res.json(rows)
			})
		})
		app.put('/'+tableName+'/:id',function(req,res){
			table.set(_.defaults({
				id: req.params.id
			},req.body)).done(function(){
				res.json({})
			})
		})
		app.post('/'+tableName,function(req,res){
			table.create(req.body).done(function(insertId){
				res.json(_.defaults(req.body,{id:insertId}))
			})
		})
		app['delete']('/'+tableName+'/:id',function(req,res){
			table.remove({
				id: req.params.id
			}).done(function(rows){
				res.json({})
			})
		})
	})
})

module.exports.initialize = function(options){
	app.listen(options.port, options.host)
	console.log("########################################")
	console.log("#          YO, I'M LISTENING           #")
	console.log("########################################")
}