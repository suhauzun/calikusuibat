(function() {
	
	var currentUser = Parse.User.current();
	if ( !currentUser ) {

		window.location.href = 'login.html';

	} else {

		window.showHud = function($elem) {
			$elem.addClass('box');
			$elem.append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
		};

		window.hideHud = function($elem) {
			$elem.removeClass('box');
			$('.overlay', $elem).detach();
		};

		$(document).ready(function() {

			$('#signOut').on('click',function() {
				Parse.User.logOut();
				window.location.href = 'login.html';
			});

			$('.username').html(currentUser.get('username'));

			var $activeParent = $('.sidebar-menu li.active'),
			 	$activeChild = $('.sidebar-menu li .active'),
			 	activeText = "";

			if ( !$activeChild.length || !$activeChild.length ) {
				return;
			}

			activeText += $('span:eq(0)', $activeParent).html();

			activeText += ' <small>' + $('a:eq(0)', $activeChild).html() + '</small>';
			
			$('.content-header h1').html(activeText);

		});

	}
    
})();