
$(document).ready(function () {

    // Open contact modal
    $('.contact').click(function(){
        $('#contactModal').modal('toggle', {
          keyboard: false
        }).on('shown.bs.modal', function(){
                var form = $('#ContactForm');
                var submitButton = $('.submitContactForm');
                submitButton.click(function(){

                    var email = $('#id_email');
                    var message = $('#id_message');

                    if(validateEmail(email.val()) && message.val() != ""){
                        //Valid information

                        $.post( "/frontpage/contact/", form.serialize(), function(data){

                            if (data == 'True'){
                                $('#contactFormContainer').hide();
                                $('.submitContactForm').hide();
                                $('.contactformWarning').hide();

                                $('.contactformSuccess').show();
                            }
                            else {
                                $('.contactformWarning').show();
                            }


                        }).fail(function() {
                            $('.contactformWarning').show();
                        });

                    }
                    else {
                        //Not valid information
                        $('.contactformWarning').show();

                    }

                });
        });
    });

    // Validate email.
    function validateEmail($email) {
      var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      if( !emailReg.test( $email ) ) {
        return false;
      } else {
        return true;
      }
    }


    // Mobile messages
    var mobileUser = jQuery.browser.mobile;

    if (mobileUser){
        $('.mobile-show').show();
        $('.mobile-hide').hide();
    }
    else {
        $('.mobile-show').hide();
        $('.mobile-hide').show();
    }




});