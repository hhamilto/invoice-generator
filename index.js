invoiceGenerator = require('./invoice-generator')
config = require('./config.json')

config.hoursWorked = 80
config.hourlyRate = 56
config.serviceDescription = "Programming"
config.invoiceNumber = 12
config.date = moment().format('MMM D, YYYY')
config.period = {
	start: moment().subtract(1,'week').day('friday').format('MMM D, YYYY'),
	end: moment().subtract(2,'week').day('monday').format('MMM D, YYYY')
}
config.dueDate = moment().add(10, 'days').format('MMM D, YYYY')


invoiceGenerator.generateInvoice(config);