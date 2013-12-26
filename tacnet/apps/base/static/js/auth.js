/*
 * Tacnet Auth API
 * Sends AJAX calls for auth
 * */


/* Variables */
var login_button = $('#login-button');
var user_button = $('#user');
var logout_button = $('#logout-button');
loggedIn = "";
var bar = $('#auth_bar');
var form = $('#form-holder');

var loginPanel = false;


/* Check login status */
function check_login() {
    $.get("/auth/status")
        .done(function( data ) {
            if (data != "False") {
                $('#user_usename').html(data);
                $( "body" ).trigger( "logged_in" );
                loggedIn = data;
            }
            else {
                $( "body" ).trigger( "logged_out" );
                loggedIn = "";
            }
        })
        .fail(function() {
            $( "body" ).trigger( "logged_out" );
            loggedIn = "";
        });
};

check_login();


/* Hide bar when click on body */
$('#body_content').click(function(){
    hide_bar();
});

/* Disable form submit */
form.submit(function( event ) {
    event.preventDefault();
});

$('#register-form').submit(function( event ) {
    event.preventDefault();
});

$('#forgot-form').submit(function( event ) {
    event.preventDefault();
});


/* Login function */
$('#login-now').click(function(){
    /* Check all fields */
    var username = $('input[name=username]').val();
    var password = $('input[name=password]').val();

    hide_error();

    if (username.length != 0 && password.length != 0){
        /*
         * Try to login
         * Use AJAX
         * */

        hide_warning();
        show_progress();

        /* AJAX */
        $.post("/auth/login", $( "#login-form" ).serialize())
            .done(function( data ) {
                hide_progress();
                if (data == "True") {
                    hide_error();
                    hide_progress();
                    hide_warning();
                    loggedIn = username;
                    $.bootstrapGrowl("Authentication - You're now logged in.", {
                        type: 'success',
                        width: 'auto'
                    });
                    $('input[name=username]').val("");
                    $('input[name=password]').val("");
                    $( "body" ).trigger( "logged_in" );
                    hide_bar();

                }
                else {
                    show_error();
                }

            })
            .fail(function() {
                hide_progress();
                show_error();
            })



    }
    else {
        /* Warning to user, must type in a password and username */
        show_warning();
    }

});

/* Logout function */
$('#logout-button').click(function(){
    $.get("/auth/logout")
        .done(function(data){
            if (data=="True"){
                loggedIn = "";
                $.bootstrapGrowl("Authentication - You're now logged out.", {
                    type: 'success',
                    width: 'auto'
                });
                $( "body" ).trigger( "logged_out" );
            }
            else {
                $.bootstrapGrowl("Authentication - Logout failed.", {
                    type: 'danger',
                    width: 'auto'
                });
            }

        })
        .fail(function(){
            $.bootstrapGrowl("Authentication - Logout failed.", {
                type: 'danger',
                width: 'auto'
            });
        });
});



/* Register Function */
$('#register-now').click(function(){

    /* Check all fields */
    var username = $('input[name=register-username]').val();
    var password = $('input[name=register-password]').val();
    var retypepassword = $('input[name=register-retypepassword]').val();
    var mail = $('input[name=register-mail]').val();

    register_hide_error();

    if (username.length != 0 && password.length != 0 && password == retypepassword){
        /*
         * Try to register
         * Use AJAX
         * */
        register_hide_warning();
        register_show_progress();

        /* AJAX */
        $.post("/auth/register", $( "#register-form" ).serialize())
            .done(function( data ) {
                register_hide_progress();
                if (data == "True") {
                    register_hide_error();
                    register_hide_progress();
                    register_hide_warning();
                    $.bootstrapGrowl("Authentication - You're now registered, you can login.", {
                        type: 'success',
                        width: 'auto'
                    });
                    $('input[name=register-username]').val("");
                    $('input[name=register-password]').val("");
                    $('input[name=register-retypepassword]').val("");
                    $('input[name=register-mail]').val("");
                    $('.register-form-holder').hide();
                    $('.login-form-holder').show();

                }
                else {
                    register_show_error();
                }

            })
            .fail(function() {
                register_hide_progress();
                register_show_error();
            })

    }
    else {
        /* Warning to user, must type in a password and username */
        register_show_warning();
    }

});


/* Register Function */
$('#forgot-now').click(function(){

    /* Check all fields */
    var mail = $('input[name=forgot-mail]').val();

    forgot_hide_error();

    if (mail.length != 0){
        /*
         * Try to recover user
         * Use AJAX
         * */
        forgot_hide_warning();
        forgot_show_progress();

        /* AJAX */
        $.post("/auth/forgotpassword", $( "#forgot-form" ).serialize())
            .done(function( data ) {
                forgot_hide_progress();
                if (data == "True") {
                    forgot_hide_error();
                    forgot_hide_progress();
                    forgot_hide_warning();
                    $.bootstrapGrowl("Authentication - New password is sendt to the mail.", {
                        type: 'success',
                        width: 'auto'
                    });
                    $('input[name=forgot-mail]').val("");
                    $('.forgot-form-holder').hide();
                    $('.login-form-holder').show();

                }
                else {
                    forgot_show_error();
                }

            })
            .fail(function() {
                forgot_hide_progress();
                forgot_show_error();
            })

    }
    else {
        /* Warning to user, must type in mail */
        forgot_show_warning();
    }

});




/* Login button */
login_button.click(function(){

    if (loginPanel) {
        hide_bar();
    }
    else {
        show_bar();
    }

});



/* Register user - show form */
$('.register-user-link').click(function(){
    $('.login-form-holder').hide();
    $('.forgot-form-holder').hide();
    $('.register-form-holder').show();
});

/* Login user - show form */
$('.register-user-login-link').click(function(){
    $('.register-form-holder').hide();
    $('.forgot-form-holder').hide();
    $('.login-form-holder').show();

});

/* Forgot password - show form */
$('.forgot-user-link').click(function(){
    $('.register-form-holder').hide();
    $('.login-form-holder').hide();
    $('.forgot-form-holder').show();
});



/* On logged in */
$( "body" ).on( "logged_in", function() {
    /* Show and hide buttons */
    login_button.hide();
    user_button.show();
    logout_button.show();

    $.get("/auth/status")
        .done(function( data ) {
            if (data != "False") {
                $('#user_usename').html(data);
            }
        });

});

/* On logged out */
$( "body" ).on( "logged_out", function() {
    /* Show and hide buttons */
    login_button.show();
    user_button.hide();
    logout_button.hide();
});
/* Helper functions */


function show_bar(){
    bar.css('height', 'auto');
    loginPanel = true;
    form.show();
};
function hide_bar(){
    bar.css('height', '30px');
    loginPanel = false;
    hide_error();
    hide_progress();
    hide_warning();
    form.hide();
};

function show_warning() {
    var notifyBox = $('#allFields');
    notifyBox.fadeOut('fast');
    notifyBox.fadeIn('fast');
};

function hide_warning() {
    var notifyBox = $('#allFields');
    notifyBox.hide();
};

function show_progress() {
    var progressBox = $('#progress');
    progressBox.fadeOut('fast');
    progressBox.fadeIn('fast');
};

function hide_progress() {
    var progressBox = $('#progress');
    progressBox.hide();
};

function show_error() {
    var errorBox = $('#error');
    errorBox.fadeOut('fast');
    errorBox.fadeIn('fast');
};

function hide_error() {
    var errorBox = $('#error');
    errorBox.hide();
};







function register_show_warning() {
    var notifyBox = $('#register-allFields');
    notifyBox.fadeOut('fast');
    notifyBox.fadeIn('fast');
};

function register_hide_warning() {
    var notifyBox = $('#register-allFields');
    notifyBox.hide();
};

function register_show_progress() {
    var progressBox = $('#register-progress');
    progressBox.fadeOut('fast');
    progressBox.fadeIn('fast');
};

function register_hide_progress() {
    var progressBox = $('#register-progress');
    progressBox.hide();
};

function register_show_error() {
    var errorBox = $('#register-error');
    errorBox.fadeOut('fast');
    errorBox.fadeIn('fast');
};

function register_hide_error() {
    var errorBox = $('#register-error');
    errorBox.hide();
};



function forgot_show_warning() {
    var notifyBox = $('#forgot-allFields');
    notifyBox.fadeOut('fast');
    notifyBox.fadeIn('fast');
};

function forgot_hide_warning() {
    var notifyBox = $('#forgot-allFields');
    notifyBox.hide();
};

function forgot_show_progress() {
    var progressBox = $('#forgot-progress');
    progressBox.fadeOut('fast');
    progressBox.fadeIn('fast');
};

function forgot_hide_progress() {
    var progressBox = $('#forgot-progress');
    progressBox.hide();
};

function forgot_show_error() {
    var errorBox = $('#forgot-error');
    errorBox.fadeOut('fast');
    errorBox.fadeIn('fast');
};

function forgot_hide_error() {
    var errorBox = $('#forgot-error');
    errorBox.hide();
};
