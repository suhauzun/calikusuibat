
(function() {

    var Model = window.Model = window.Model || {};

    Model.getList = function (_class, list, group) {

        var setResult = arguments.length > 1;
        if ( _class ) {
            var query = new Parse.Query(_class);

            return query.find({
                success: function(result) {
                    if ( setResult ) {
                        if ( group ) {
                            list['items'] = Model.groupById(result) ;
                        } else {
                            list['items'] = result;
                        }
                    }
                },
                error: function(object, error) {
                    console.log('error');
                }
            });
        } else {

            return undefined;
            
        }

    };

    Model.groupById = function( list ) {
        return _.groupBy(list,function(item) { return item.id;});
    };

    Model.getLanguageValue = function(value, languageCode) {
        return value[languageCode||window.languageCode||'tr'];
    };

    Model.getItemById = function ( _class, id, item, includes){

        var setResult = arguments.length > 2;
        if ( _class ) {
            var query = new Parse.Query(_class);

            query.equalTo('objectId',id);

            _.each(includes,function(inc) {

                query.include(inc);

            });

            return query.find({
                success: function(result) {
                    if ( setResult ) {
                        if ( item ) {
                            item['item'] = result[0];
                        } 
                    }
                },
                error: function(object, error) {
                    console.log('error');
                }
            });
        } else {

            return undefined;
        }

    };

    var languageCodes = ['tr','en','ru'];
    Model.setDefaultLanguage = function() {

        var splitted = window.location.pathname.split('/'),
            languageCode = splitted[splitted.length-2];

        if ( languageCodes.indexOf(languageCode) > -1 ) {

            window.languageCode = languageCode;
            return;
        }

        window.languageCode = 'tr';

    };

    Model.setDefaultLanguage();
 
})();
