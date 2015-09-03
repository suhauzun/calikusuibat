(function() {

	$(document).ready(function() {

		if ( Parse.User.current() ) {

			window.location.href = 'dashboard.html';

		} else {

			var $loginForm = $('#login-form'),
				$submitButton = $('button[type=submit]', $loginForm);

			$loginForm.validate({
				rules :{
					email: {
	      						required: true
	    					},
					password : 'required'
				},
				messages:{
					username: {
						required: 'Please enter your username.'
					},
					password : {
						required :'Please enter your password.'
					}
				}
			});

			$loginForm.on('submit',function(e){

				e.preventDefault();
				if( $loginForm.valid() ) {

					$submitButton.attr('disabled','disabled');

					Parse.User.logIn($('#username').val(), $('#password').val(), {
	        			success: function(user) {
	        				$submitButton.removeAttr('disabled');
	          				window.location.href = 'dashboard.html';
	        			},
	        			error: function(user, error) {
	          				Parse.User.logOut();
	          				alert('Please check your username and/or password.');
	          				$submitButton.removeAttr('disabled');
	        			}
	      			});
				}

			});
		}

	});
		
		
    
})();