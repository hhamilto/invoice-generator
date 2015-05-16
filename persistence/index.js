mysql = require('mysql')
_ = require('lodash')
deferred = require('deferred')

fs = require('fs')
util = require('util')

migrationService = require('./migration-service.js')
migrationService.runMigrations().done()


conf = require('./conf.json')

conn = mysql.createConnection(conf.database)

conn.query('SHOW TABLES', function(rows){
	_.each(rows, console.log)
})

done = deferred()
module.exports.done = done.promise
