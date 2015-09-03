(function(){

	String.prototype.format = function(){
		var str = this.valueOf();
		
		for (var i = 0; i < arguments.length; i++)
			str = str.split("{" + i + "}").join(arguments[i]);

		return str;
	};

	function map (key, languageCode){
		return resources[languageCode || window.languageCode ||'tr'][key] || 'NOT_APPLICABLE';
	};


	var resources = map;

	if (typeof(window) === 'undefined') {
    	resources = module.exports;
    } else {
	    if (typeof(window.resources) === 'undefined') window.resources = map;
	    resources = window.resources;
    }

    resources['tr'] = {};
    resources['tr']['PRICE_TABLE'] = 'Fiyat Tablosu';
    resources['tr']['NUMBER_OF_DAYS'] = '{0} Gün';
    resources['tr']['FILL_FORM'] = 'Detaylı bilgi için tıklayıp formu doldurunuz.';



    resources['en'] = {};
    resources['en']['PRICE_TABLE'] = 'Price Table';
    resources['en']['NUMBER_OF_DAYS'] = '{0} Days';
    resources['en']['FILL_FORM'] = 'Fill the form to get detailed information.';

    resources['ru'] = {};
    resources['ru']['PRICE_TABLE'] = 'Цена Таблица';
    resources['ru']['NUMBER_OF_DAYS'] = '{0} дней';
    resources['ru']['FILL_FORM'] = 'Заполните форму для получения дополнительной информации.';
    
})();