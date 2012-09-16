;(function(win){
  var User = typeof User === 'undefined' ? {} : User;
  var Event = typeof Event === 'undefined' ? {} : Event;
  var urls = {
    signup: '/signup',
    signin: '/signin'
  };
  var FORM_TYPE = {
    'SIGNUP': 1,
    'SIGNIN': 2
  };

  var signupBtn;
  var signinBtn;

  User.formFit = function(type){
    var userForm = $('#user-form');
    var submitBtn = $('#submit-btn');

    switch(type){
      case FORM_TYPE.SIGNUP: 
        userForm.attr('action',urls.signup);
        submitBtn[0].className = 'btn';
        submitBtn.html('Sign up')
        break;
      case FORM_TYPE.SIGNIN:
        userForm.attr('action',urls.signin);
        submitBtn[0].className = 'btn btn-primary';
        submitBtn.html('Sign in');
        break;
    }
    User.hideFormEntry();
    userForm.removeClass('hide');
  };

  User.hideFormEntry = function(){
    if(!signupBtn.hasClass('hide')){
      signupBtn.addClass('hide');
    }

    if(!signinBtn.hasClass('hide')){
      signinBtn.addClass('hide');
    }
  };

  Event.bindUserFormClick = function(){
   
    signupBtn.click(function(){
      User.formFit(FORM_TYPE.SIGNUP)
    });

    signinBtn.click(function(){
      User.formFit(FORM_TYPE.SIGNIN);
    });




    console.log(signupBtn);
  };

  function initDom(){
    signupBtn = $('#signup-btn');
    signinBtn = $('#signin-btn');
  };


  function init(){
    initDom();
    Event.bindUserFormClick();
  }


  $(function(){
    init();
  });
})(window);