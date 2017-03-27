angular.module('app', [
    'ui.router',
    'ngMaterial'
])

.constant('API', {
    url: null
})

/** 
 * Route the user to the appropriate template and controller
 */
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $windowProvider, API){
    
    $locationProvider.html5Mode({
        enabled: true
    });

    /**
     * If html5Mode is enabled, this section will ensure that you have a 
     * <base> tag within you index page with the correct location. This is 
     * a necessary feature to run html5 mode correctly in either a rooted
     * or sub folder maner
     */
    var $window = $windowProvider.$get();
    var parts = $window.location.pathname.split('/');
    parts.shift();
    parts[parts.length-1] = 'index.html';
    var base = document.createElement('base');
    base.href = '/' + parts.join('/');
    API.url = base.href.replace('/index.html', '');
    document.getElementsByTagName('head')[0].appendChild(base);
    
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'app/components/home/index.html',
            controller: 'HomeController',
            controllerAs: 'home',
            authorization: false
        })
        .state('about', {
            url: '/about',
            templateUrl: 'app/components/about/index.html',
            controller: 'AboutController',
            controllerAs: 'about',
            authorization: false
        })
        .state('contact', {
            url: '/contact',
            templateUrl: 'app/components/contact/index.html',
            controller: 'ContactController',
            controllerAs: 'contact',
            authorization: false
        })
        .state('404', {
            url: '/404',
            templateUrl: 'app/components/error/404/index.html',
            controller: 'Error404Controller',
            controllerAs: 'error404',
            authorization: false
        })
})


/**
 * Run App
 */
.run(function($rootScope, $location, $document, $state, $http, $q){

    $rootScope.$on('$locationChangeStart', function(event, next, current) { 
        var state = $location.path().substr(1);
        var stateObject = $state.get(state);

        /**
         * State Monitoring and Authorization Block
         * 
         * Monitors current requested state and validates if it exists
         * if not, the user is forward to an error (404) page else the
         * user is allowed to access the page if no futher authorization
         * is requred
         */
        
        if(state == ''){
            $state.go('home');
        }else if(stateObject == null){
            $state.go('404');
        }else{
            if(stateObject.authorization == true){
                event.preventDefault();
                $state.go('login');
                return;
            }else{
                $state.go(state);
            }
        }
    });

    function ifAuthorized(required){
        var deferred  = $q.defer();

        /*$http.get('/api')
        .then(function(resp){
            console.log(resp);
        }, function(err){
            console.log(err);
        });*/

        if(required == true){
            deferred.resolve();
        }else{
            deferred.resolve();
        }

        return deferred.promise;
    }
    
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        ifAuthorized(toState.authorization);
        $rootScope.page =  toState.url.substr(toState.url.indexOf('/') + 1);
        $rootScope.siteTitle = 'Angular-App';
        $rootScope.tagLine = 'Test';
        $document[0].title = $rootScope.siteTitle + ' : ' + $rootScope.page;
    });

})


/**
 * Main Controller
 */
.controller('MainController', function($scope, API){

    var self = this;

})