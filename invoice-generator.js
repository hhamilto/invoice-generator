_ = require('lodash')
Pdfkit = require('pdfkit')
moment = require('moment')

fs = require('fs')

generateDefaultOptions = function(options){
	if(!options.fileName){
		options.fileName = 'Invoice_'+moment().format('YYYY-MM-DD')+'.pdf'
	}
}


module.exports.generateInvoice = function(options){
	generateDefaultOptions(options)

	var doc = new Pdfkit;
	doc.pipe(fs.createWriteStream(options.fileName))
	doc.fontSize(25).text(options.invoicer.name+' Invoice', {align:'center'})
	doc.fontSize(12).text('\n'+options.invoicer.name, {align:'center'})
	doc.text(options.invoicer.address, {align:'center'})

	doc.text('\n')

	var columnStartY = doc.y
	var secondColumnX = doc.page.width/2 + 10;
	doc.text(options.invoicee.name, {
		align:'left'})
	doc.text(options.invoicee.address)
	doc.text('Invoice #: '+options.invoiceNumber, secondColumnX, columnStartY)
	doc.text('Date: ' + options.date)
	doc.text('Period: ' + options.period.start + ' – ' + options.period.end)
	doc.text('Due: ' + options.dueDate +' (NET 10)')

	doc.text('\n')
	leftAlignX = doc.page.margins.left
	rowStartY = doc.y
	doc.font('Helvetica-Bold')
	doc.text('Services',leftAlignX)
	doc.text('Hours', leftAlignX+ 100, rowStartY)
	doc.text('Rate', leftAlignX+ 250, rowStartY)
	doc.text('Total', leftAlignX+ 400, rowStartY)
	// <hr/>
	doc.rect(leftAlignX, doc.y, doc.page.width - doc.page.margins.left -doc.page.margins.right, 1).stroke()
	doc.moveDown();
	rowStartY = doc.y
	doc.font('Helvetica')
	doc.text(options.serviceDescription,leftAlignX)
	doc.text(options.hoursWorked, leftAlignX+ 100, rowStartY)
	doc.text('$'+ options.hourlyRate, leftAlignX+ 250, rowStartY)
	doc.text('$'+ options.hoursWorked*options.hourlyRate, leftAlignX+ 400, rowStartY)

	console.log(doc.page)
	doc.end()
}

