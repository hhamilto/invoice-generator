fs = require('fs')

express = require('express')
_ = require('lodash')

config = require('./config.json')
invoiceGenerator = require('../invoice-generator')


var express = require('express')
var app = express()

app.use('/app/', express.static(__dirname + '/public'));

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

module.exports.initialize = function(options){
	app.listen(options.port, options.host)
	console.log("########################################")
	console.log("#          YO, I'M LISTENING           #")
	console.log("########################################")
}