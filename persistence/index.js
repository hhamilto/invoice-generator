mysql = require('mysql')
_ = require('lodash')
deferred = require('deferred')

fs = require('fs')
util = require('util')

conf = require('./conf.json')

whereClauseFromObject = function(obj){
	return _.map(_.pairs(obj), function(pair){
		return mysql.escapeId(pair[0]) + '='+mysql.escape(pair[1])
	}).join(' AND ')
}
migrationService = require('./migration-service.js')
module.exports.initialize =function(){
	var dbReady = deferred()

	var conn = mysql.createConnection(conf.database)
	migrationService.runMigrations().done(function(){
		var ignoredTables = ['Migrations']

		conn.query('SHOW TABLES', function(err,rows){
			var tables = _.without(_.map(rows,'Tables_in_HoursManagement'), 'Migrations')
			_.each(tables, function(table){
				module.exports[table] = {}
				module.exports[table].create = function(newObj){
					dfd = deferred()
					conn.query('INSERT INTO '+table+' SET ?', newObj, function(err, result){
						if(err)dfd.reject(err)
						else dfd.resolve(result.insertId)
					})
					return dfd.promise
				}
				module.exports[table].get = function(obj){
					dfd = deferred()
					conn.query('SELECT * FROM '+table+' WHERE '+ whereClauseFromObject(obj), function(err, rows){
						if(err)dfd.reject(err)
						else dfd.resolve(rows)
					})
					return dfd.promise
					
				}
				module.exports[table].set = function(newObj){
					dfd = deferred()
					conn.query('UPDATE '+table+' SET ?', newObj, function(err, result){
						if(err)dfd.reject(err)
						else dfd.resolve(result.insertId)
					})
					return dfd.promise
				}
				module.exports[table].remove = function(obj){
					dfd = deferred()
					var query = conn.query('DELETE FROM '+table+' WHERE '+whereClauseFromObject(obj), function(err, result){
						console.log(query.sql)
						if(err)dfd.reject(err)
						else dfd.resolve()
					})
					return dfd.promise
				}
			})
			dbReady.resolve()
		})
	})
	return dbReady.promise
}


