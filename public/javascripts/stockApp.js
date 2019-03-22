
var app = angular.module('stockApp',['ngRoute','angular-loading-bar','ngCookies', 'ui.router','ngResource','chart.js']).run(function($cookies,$window,$rootScope,$route,$http){
    $rootScope.authenticated = false;
    $rootScope.username= '';
    $rootScope.registered = ''

    $window.onbeforeunload = function() {
        console.log('what alkj')
/*
       if(!validNavigation){
        // Clearing all cookies now!
        
       console.log('reloding')
      console.log('error')
       $cookies.remove('email')
       $cookies.remove('user');
     var logout = function(){//logout controller
            console.log('logout session')
        
            $http.post('/auth/signout').success(function(data){
             if(data.state == 'success')
             { 
                 $cookies.remove('email')
                 $cookies.remove('user');
                 $cookies.remove('mycookie')
                 $rootScope.username = '';
                 $rootScope.authenticated = false;
                
             }else{
                 console.log('error');
             } })};
logout();
       
    };
    */

}

})
.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      chartColors: ['brown', 'green'],
      responsive: false
    });
    // Configure all line charts
    ChartJsProvider.setOptions('line', {
      showLines: true
    });
  }])



.config(['$stateProvider', '$urlRouterProvider', function($stateProvider,$cookies, $urlRouterProvider) {
    
    $stateProvider
 .state('/',
{
    url:'/',
   templateUrl:'main.html',

    controller:"mainController",
}).state('tomain',
{
    url:'',
   templateUrl:'main.html',

    controller:"mainController",
}
)

.state('userProfile',
{
    url:'/userProfile',
   templateUrl:'userProfile.html',

    controller:"userController",
}
)

.state('register', //register controller    
{
    url:'/register',
   templateUrl:'register.html',

    controller:"registerController",
}
).state('/BasicDetailsAccount',{//basic detail account controller
    url:'/BasicDetailsAccount',
    templateUrl:"BasicDetailsAccount.html",
    controller:'basicDetailController'
})

.state('login',
{
    url:'/login',
   templateUrl:'login.html',
    controller:'loginController'
}
)

.state('resetPassword',
{
    url:'/resetPassword',
   templateUrl:'resetPassword.html',

    controller:"resetPasswordController",
}).state('emailNotification',{
    url:'/emailNotification',
    templateUrl:'emailNotification.html',
    controller:'emailController'
}).state('reEnterPassword',{
    url:'/reEnterPassword',
    templateUrl:'reEnterPassword.html',
    controller:'reEnterPasswordController'
})


}])

app.factory('postServices',function($resource){
    return $resource('/cityName/city');
})


app.factory('logoutServices',function($resource){
    return $resource('/auth/signout');
})

app.factory('basicDetailsStoreService',function($resource){
    return $resource('/basicinfo/basic');
})
app.controller('reEnterPasswordController',function($scope,$http,$location){//setting of new password
    $scope.user = {
        token:'',
        pass1:''
      
                 }
     $scope.reEnterPassword = function(){ 
      
           $scope.user.pass1 = $scope.pass1;
          $scope.user.token = $location.search();
         console.log($scope.user.token.valid);
         
          $http.post('/emailNotification/passwordReset',$scope.user)    //resetting new password
     $location.path('/login') 

    }
})
app.controller('resetPasswordController',function($scope,$http,$location,$rootScope){//sending email notification
    
 $scope.resetPassword=function(){  
     
    $http.post('/emailNotification/sendResetPassword',$scope.user) //sending email notification of new password setting
    $location.path('/login') 
 }

})

//email notification controller
app.controller('emailController',function($scope ,$http){
$scope.emailNotification = function(){
    $http.post('/emailNotification/sendNotification',$scope.sendemail)

}
});

//basic detail controller
app.controller('basicDetailController',function($rootScope,$scope,postServices,basicDetailsStoreService){
   

    $scope.cityName = postServices.query();
    
    $scope.basicinfo = { resident1:'',resident2:'',city:'',zip:'',cell_number:'' };
     $scope.basicinfo.user_register = $rootScope.registered;
 $scope.basicInfo = function(){
     basicDetailsStoreService.save($scope.basicinfo,function(){
        $scope.basicinfo = { resident1:'',resident2:'',city:'',zip:'',cell_number:'' };

     });


    


 };
$scope.progress = 35;

})
//login controller
app.controller('loginController',function($cookies,$scope,$rootScope,$http,$location){

 
    $scope.user={
        username:'',
        firstname:'',
        lastname:'',
        email:'' ,
password:''
    }

    $http.post('/auth/sessionExpire',).success(function(data){
        console.log("yes plese");

        console.log('checking it')
        if(data.state == 'success')
        {
            $cookies.put('email',data.user.email);

            $cookies.put('user',data.user.firstname+' '+data.user.lastname)
            $rootScope.current_user = $cookies.get('user');

            $location.path('/userProfile')
           
            console.log('output'+data.user.firstname);
     
        }
       else if(data.state == 'false'||data.status == 500){
            console.log('no output');
        }

        


// ive to learn how express.js set cookies can access in angularjs



      //  $location.path('/login')

    });

 
    $scope.login = function(){
        $rootScope.login_user = true;
        $rootScope.username = $scope.user.username;
/*


*/
        $http.post('/auth/login',$scope.user).success(function(data){
            if(data.state == 'success'){

              console.log( $cookies.get('mycookie'));


              $rootScope.authenticated = true;
            $cookies.put('email',data.user.email)
         $cookies.put('user',data.user.firstname+' '+data.user.lastname)
         $rootScope.current_user = $cookies.get('user');
         console.log($cookies.get('user'))
              $location.path('/userProfile');
               
            }
            else if(data.state == 'noUser') {
                $scope.error_message_nouser = data.message[0];
                $scope.nouser=true;
                $scope.notokenverified=false;
                $scope.wrongpassword=false;

                console.log($scope.error_message);
              }
              else if(data.state == 'noToken') {
                $scope.error_message_notoken_verified   = data.message[0];
                $scope.nouser=false;
                $scope.notokenverified=true;
                $scope.wrongpassword=false;
                console.log($scope.error_message);
              }
              else if(data.state == 'passwordWrong') {
                $scope.error_message_wrongpassword = data.message[0];
                $scope.nouser=false;
                $scope.notokenverified=false;
                $scope.wrongpassword=true;
                console.log($scope.error_message);
              }
        })

    }
       //token resending
       $scope.tokenresend = function(){
        $scope.user.username = $rootScope.username;
        $http.post('/emailNotification/sendTokenAgian',$scope.user)
    }








})

//login and signout controller

app.controller('registerController',function($cookies,$scope,$rootScope,$http,$location){

   
    $scope.user={
        username:'',
        firstname:'',
        lastname:'',
        email:'' ,
password:''
    }

 
    
   
    $scope.register=function(){       
       // $rootScope.signup=true;
       $rootScope.registered = $scope.user.email;
        $http.post('/auth/signup',$scope.user).success(function(data){
            if(data.state == 'success'){

             $location.path('/BasicDetailsAccount');
              }
              else if(data.state == 'failure') {
                $scope.error_message = data.message;
                console.log(data.state);
              }
        })



    }



$scope.progress = 20;

})
//main page controller


app.controller('mainController',function($http,$cookies,$scope,$rootScope,$location){
//$scope.logout = logoutServices.query();//logout session




$rootScope.signup=false;
$rootScope.login=false;


})



// topbar controller
app.controller('topbarController',function(){

})

app.controller('userController',function($cookies,$http,$location,$scope,$rootScope,$timeout){
 //   console.log($cookies.get('email'))
 //  console.log($cookies.get('mycookie'))
 $http.post('/auth/sessionExpire').success(function(data){
    console.log("yes plese");

    console.log('checking it')
    if(data.state == 'success')
    {
        $cookies.put('email',data.user.email);

        $cookies.put('user',data.user.firstname+' '+data.user.lastname)
        $rootScope.current_user = $cookies.get('user');

      
        console.log('output'+data.user.firstname);
 
    }
   else if(data.state == 'false'){
       $http.post('/auth/signout').success(function(data){
           console.log('yes please')
           if(data.state=='success')
           $cookies.remove('email')
           $cookies.remove('user');

        $location.path('/login')

       })
       
    }})


 $http.post('/auth/userdata').success(function(data){

if(data.state == 'success' && $cookies.get('email')!=null &&$cookies.get('user')!=null)
{
    console.log('yes its fine');

}


//ive to check if i delete the cookie then what will happen?? or modified the cookie than what will happen





/*
else if(data.state=="false"||$cookies.get('email')==null||$cookies.get('user')!=null){ ////////////// if mycookie is deleted the session will be loggedout
console.log('what up?')
$http.post('/auth/signout').success(function(data){
if(data.state == 'success'){
    $cookies.remove('email')
    $cookies.remove('user');
//  if(!$cookies.get('email')&&!$cookies.get('user'))
    $location.path("/login");
}
else{
    console.log('you couldnot modified session cookie deleted')
}
})
                  
    
    
}

*/
else{
    console.log('you couldnot modified session cookie deleted')
}
 })




//chart data
$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Stock rate'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    
  ];
  $scope.Click = function (points, evt) {
    console.log(points, evt);
  };
  
  // Simulate async data update
  
//end chart data




$rootScope.current_user = $cookies.get('user');




//user data showing here on the front page





//signout functionality

    $rootScope.signout = function(){//logout controller
        console.log('signout');
               $http.post('/auth/signout').success(function(data){
                if(data.state == 'success')
                { 
                    $cookies.remove('email')
                    $cookies.remove('user');
                    $cookies.remove('mycookie')
                    $rootScope.username = '';
                    $rootScope.authenticated = false;
                    $location.path("/login");
                }else{
                    console.log('error');
                } })};
            })