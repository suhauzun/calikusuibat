(function() {

	var DataTable = window.DataTable = {},	
		dataItem,
		data = [];

	DataTable.options = {
			'listItems'   : []
	};

	DataTable.dataType = {
		Regular  	: 1 << 0,
		Pointer 	: 1 << 1,
		Image   	: 1 << 2,
		Operation 	: 1 << 3
	};

	DataTable.operationType = {
		Update : 1 << 0,
		Remove : 1 << 1
	};

	/*function _getDataCount(callback) {
		var query = new Parse.Query(dataItem);
		query.count({
			success: function(count) {
				if ( !DataTable.options.pagination ) {
					DataTable.options.itemPerPage = count;
				}
				dataCount = count;
				if ( callback ) callback();
			},
			error: function(error) {
				dataCount = 0 ;
				if ( callback ) callback();
			}
		});
	};*/

	window.removeItem = function(index) {

		var item = data[index];

		if ( item ) {

			var confirmed = confirm('Seçtiğiniz öge silenecekir.');

			if ( confirmed ) {

				DataTable.showHud();

				item.destroy({
  					success: function() {
  						$('tr[data-index=' + index + ']',DataTable.options.element).detach();
    					DataTable.hideHud();

    					if ( DataTable.options.onRemoveCompleted ) {

    						DataTable.options.onRemoveCompleted(item);

    					}

  					},
  					error: function(myObject, error) {
    					alert('Failed to delete object, with error code: ' + error.message);
    					DataTable.hideHud();
  					}
				});

			}
		
		}
	};

	window.updateItem = function(index) {

		var item = data[index];

		window.location = DataTable.options.updateUrl + '?ID=' + item.id;

	};

	function _isFunction(functionToCheck) {
	 	var getType = {};
	 	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	};

	function _mapItems(){
		return _.map(data, function(item,i){
					var result = [];
					_.each(DataTable.options.listItems, function(listItem) {

						if (listItem.render) {

							if (_isFunction(listItem.render)){

								result.push(listItem.render(item.get(listItem.propertyNameF)));

							} else {

								result.push(listItem.render);

							}

							return;

						}

						switch(listItem.dataType) {
							case DataTable.dataType.Pointer: {
								result.push(item.get(listItem.propertyNameF).get(listItem.propertyNameT));
							}
							break;
							case DataTable.dataType.Image: {
								result.push('<img class="lazy" src="assets/img/spinner.gif" data-src="' + item.get(listItem.propertyNameF)._url + '" width="107" height="75" />');
							}
							break;
							case DataTable.dataType.Operation: {

								var buttons = [];
								if ( listItem.operations & DataTable.operationType.Update == DataTable.operationType.Update) {
									buttons.push('<button type="button" class="btn btn-success" onclick="updateItem(' + i + ')"><i class="fa fa-rotate-left"></i></button>');
								}

								if ( listItem.operations & DataTable.operationType.Remove == DataTable.operationType.Remove) {
									buttons.push('<button type="button" class="btn btn-danger" onclick="removeItem(' + i + ')"><i class="fa fa-minus-square"></i></button>');
								}

								result.push(buttons.join('<span>  <span>'));

							}
							break;
							case (DataTable.dataType.Pointer | DataTable.dataType.Image): {
								result.push('<img class="lazy" src="assets/img/spinner.gif" data-src="' + item.get(listItem.propertyNameF).get(listItem.propertyNameT)._url + '" width="107" height="75" />');
							}
							break;
							case DataTable.dataType.Regular:
							default: {
								result.push(item.get(listItem.propertyNameF));
							}
						}

					});
					return result;
				});

		
	}

	function _render (){
		var template = _.template($('#data-table-template').html());
			templateData = {
						'dataTitles' : _.map(DataTable.options.listItems,function(listItem) { return listItem.title; } ),
						'items'		 : _mapItems()
				};
		DataTable.options.element.html(template({'data':templateData}));
		DataTable.unveil();
	};

	DataTable.fetch = function(includes, callback){

		var query = new Parse.Query(dataItem);
		_.each(includes,function(inc) {

			query.include(inc);

		});

		query.find({
			success: function(results) {

				if ( callback ) 
					callback(results);

			},
			error: function(error) {

				if ( callback ) 
					callback();

			}
		});

	};

	DataTable.unveil = function() {
		$("img.lazy", this.options.element).unveil(250, function() {
	         $(this).on('load', function() {
	             this.style.opacity = 1;
	          });
	     });
	};

	DataTable.showHud = function() {
		var $elem = this.options.element;
		$elem.addClass('box');
		$elem.append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
	};

	DataTable.hideHud = function() {
		var $elem = this.options.element;
		$elem.removeClass('box');
		$('.overlay', $elem).detach();
	};

	/*
	options			Type
	className 		string
	listItems		array [{'dataType':0,'propertyNameF':'test1','title':'testTitle1'},{'dataType':1,'propertyNameF':'test1', 'propertyNameT':'test1','className':'test2','title':'testTitle2'}]
	element			jquery element
	updateUrl		string
	*/
	DataTable.init = function(options) {

		_.extend(this.options, options);

		if( !this.options.listItems.length || !this.options.className || !(this.options.element instanceof jQuery) )
			return;

		this.showHud();

		var listItems = this.options.listItems,
			includes = [];

		_.each(listItems, function(listItem){

			if ( (listItem.dataType & DataTable.dataType.Pointer) == DataTable.dataType.Pointer ) {

				includes.push(listItem.propertyNameF);

			}

		});

		dataItem = Parse.Object.extend(this.options.className);

		DataTable.fetch( includes, function(result) {

			data = result;
			_render();
			DataTable.hideHud();
		
		});
		
	};

})();