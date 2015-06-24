Backbone.$ = $
$(document).ready(function(){
	blankIfNull = function(a){
		return a==null?'':a
	}


	var BasicInputView = Backbone.View.extend({
		tagName: 'span',
		template: _.template($('#basic-input-template').html()),
		initialize: function(){
			this.$el.html(this.template({o:{name:this.model.Field, type:'text'}}))// put properties off object o so that lodash doesn't complain about undef
		}
	})


	var getEntityListItemView = function(columns){
		return Backbone.View.extend({
			tagName: 'li',
			template: _.template($("#entity-list-item-template").html()),
			initialize: function(options) {
				this.$el.html(this.template(this.model))
				console.log(_.reject(columns, {Field:'id'}))
				_.each(_.reject(columns, {Field:'id'}), function(column){
					var inputView = new BasicInputView({model: column})
					this.$el.find('.js-entity-list-item').prepend(inputView.el)
				}.bind(this))
			}
		})
	}

	var EntityListView = Backbone.View.extend({
		template: _.template($("#entity-list-template").html()),
		initialize: function(options) {
			_.bindAll(this)
			this.$el.html(this.template())
			var EntityListItemDfd = $.Deferred()
			var EntityListItemView
			$.get('/schema/tables/'+options.tableName).done(function(columns){
				EntityListItemView = getEntityListItemView(columns)
				EntityListItemDfd.resolve()
			})
			var Entity = Backbone.Model.extend({
				tableName: options.tableName
			})
			var EntityList = Backbone.Collection.extend({
				model: Entity,
				url: options.tableName
			})
			var entityList = new EntityList
			entityList.fetch()
			entityList.on('add', function(){
				EntityListItemDfd.done(function(){

				})
			})
			EntityListItemDfd.done(function(){
				var entityListItemView = new EntityListItemView({model: new Entity() })
				this.$el.find('ul').append(entityListItemView.el)
			}.bind(this))
		},
	})

	var NavigatorLinkView = Backbone.View.extend({
		tagName: 'li',
		template: _.template($("#navigator-link-template").html()),
		initialize: function(options) {
			this.$el.html(this.template({name:this.model}))
		}
	})

	var NavigatorView = Backbone.View.extend({
		template: _.template($("#navigator-bar-template").html()),
		initialize: function(options) {
			this.$el.html(this.template(this.model))
			var $navUL = this.$el.find('ul.js-link-list')
			_.each(this.model, function(tableName){
				$navUL.append(new NavigatorLinkView({model: tableName}).el)
			})
		}
	})


	var AppRouter = Backbone.Router.extend({
	})
	// Instantiate the router
	var appRouter = new AppRouter

	$.get('/schema/tables/').done(function(tables){

		var navView = new NavigatorView({model:tables})
		$('body').prepend(navView.el)
		var $appContainer = $('#js-app-container')
		_.each(tables, function(table){
			var tableView = new EntityListView({
				tableName: table
			})
			appRouter.route(table, table, function(){
				$appContainer.children().detach()
				$appContainer.append(tableView.el)
			})
		})
		Backbone.history.start(); 
		appRouter.navigate(tables[0], {trigger: true})
	})
})