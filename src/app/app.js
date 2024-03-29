angular.module('app', [
    'ui.router',
    'ngMaterial',
    'ngMessages',
    'smoothScroll'
])

    /** 
     * Route the user to the appropriate template and controller
     */
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $windowProvider) {

        $locationProvider.hashPrefix('!');
        
        $stateProvider
            .state('404', {
                url: '/404',
                templateUrl: './app/components/error/404/index.html',
                controller: 'Error404Controller'
            })
            .state('home', {
                url: '/home',
                templateUrl: './app/components/home/index.html',
                controller: 'HomeController'
            });


        $urlRouterProvider
            .when('', function ($injector) {
                // html5Mode false
                var $state = $injector.get('$state');
                $state.go('home');
            })
            .when('/', function ($injector) {
                // html5Mode true
                var $state = $injector.get('$state');
                $state.go('home', null, {
                    location: false
                });
            })
            .otherwise(function ($injector) {
                var $state = $injector.get('$state');
                $state.go('404', null, {
                    location: false
                });
            });
    })


    /**
     * Run App
     */
    .run(function ($rootScope, $document, $state) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.page = toState.url.substr(toState.url.indexOf('/') + 1);
            $rootScope.siteTitle = 'Angular-App';
            $rootScope.tagLine = 'Test';
            $document[0].title = $rootScope.siteTitle + ' : ' + $rootScope.page;
        });
    });