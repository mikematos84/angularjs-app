angular.module('app', [
    'ui.router',
    'ngMaterial'
])

/** 
 * Route the user to the appropriate template and controller
 */
.config(
    ['$stateProvider', '$urlRouterProvider', '$locationProvider'
    ,function($stateProvider, $urlRouterProvider, $locationProvider){

    $locationProvider.html5Mode(true);
    
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
}])


/**
 * Run App
 */
.run(function($rootScope, $location, $document, $state){

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
                $state.go('home');
                return;
            }else{
                $state.go(state);
            }
        }
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        $rootScope.page =  toState.url.substr(toState.url.indexOf('/') + 1);

        $rootScope.siteTitle = 'Angular-App';
        $rootScope.tagLine = 'Test';
        $document[0].title = $rootScope.siteTitle + ' : ' + $rootScope.page;
    });

})