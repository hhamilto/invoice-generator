$(function() {
	Backbone.$ = $
	
	var Client = Backbone.Model.extend({urlRoot: '/Clients/' })
	var Project = Backbone.Model.extend({urlRoot: '/Projects/'})
	var Hour = Backbone.Model.extend({urlRoot: '/Hours/' })
	var Invoices = Backbone.Model.extend({urlRoot: '/Invoices/' })
	
	//Collections
	var ClientList = Backbone.Collection.extend({ model: Client, url: '/Clients/' })
	var ProjectList = Backbone.Collection.extend({ model: Project, url: '/Projects/' })
	var HourList = Backbone.Collection.extend({ model: Hour, url: '/Hours/' })
	var InvoicesList = Backbone.Collection.extend({ model: Invoices, url: '/Invoices/' })


	var ProjectListView = Backbone.View.extend({
		template: _.template($("#project-list-template").html()),
		initialize: function(options) {
			_.bindAll(this)
			this.model = model = []
			projectList = new ProjectList()
			projectList.fetch()
			projectList.on('add', function(project){
				project.collection = projectList;
				model.push(new ProjectListItemView({model:project, parentView: this}))
				this.render()
			}.bind(this))
			this.$el.html(this.template())
			projectList.add(new Project())
		},
		remove: function(childView){
			this.model = _.without(this.model,childView)
			this.render()
		},
		render: function() {
			this.$el.find('ul li').detach()
			_.each(this.model,function(view){
				view.render()
				this.$el.find('ul').append(view.el)
			}.bind(this))
		}
	})

	var ProjectListItemView = Backbone.View.extend({
		tagName:'li',
		template: _.template($("#project-list-item-template").html()),
		initialize: function(options) {
			_.bindAll(this)
			this.parentView = options.parentView
			this.model = this.model || new Project()
			this.$el.html(this.template(this.model))
			this.$el.find('input').on('change', function(){
				this.syncModelToDom()
				if(!this.model.isNew() )
					this.model.save()
			}.bind(this))
			this.$el.find('button.js-create').on('click', function(){
				this.syncModelToDom()
				this.model.save()
			}.bind(this))
			this.$el.find('button.js-delete').on('click', function(){
				this.model.destroy()
				this.parentView.remove(this)
			}.bind(this))
		},
		syncModelToDom: function(){
			this.model.set('name', this.$el.find('input.js-name').val())
			this.model.set('hourlyRate', this.$el.find('input.js-hourly-rate').val())
		},
		render: function() {
			
		}
	})


	var ProjectListView = new ProjectListView()

	$('#app-container').append(ProjectListView.el)


});


