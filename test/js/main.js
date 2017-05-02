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
    
    $locationProvider.html5Mode(true).hashPrefix('!');
    
    $stateProvider
        .state('404', {
            url: '/404',
            templateUrl: './components/error/404/index.html',
            controller: 'Error404Controller'
        })
        .state('home', {
            url: '/home',
            templateUrl: './components/home/index.html',
            controller: 'HomeController'
        });

    
        $urlRouterProvider
            .when('', function($injector){
                // html5Mode false
                var $state = $injector.get('$state');
                $state.go('home');
            })
            .when('/', function($injector){
                // html5Mode true
                var $state = $injector.get('$state');
                $state.go('home', null, {
                    location: false
                });
            })
            .otherwise(function($injector) {
                var $state = $injector.get('$state');
                $state.go('404', null, {
                    location: false
                });
            }); 
})


/**
 * Run App
 */
.run(function($rootScope, $document, $state){
    
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        $rootScope.page =  toState.url.substr(toState.url.indexOf('/') + 1);
        $rootScope.siteTitle = 'Angular-App';
        $rootScope.tagLine = 'Test';
        $document[0].title = $rootScope.siteTitle + ' : ' + $rootScope.page;
    });

});
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

angular.module('app')
.controller('HomeController'
,['$scope'
,function($scope, $stateParams){

    var self = this;

    $scope.content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu nunc vestibulum, malesuada mi quis, interdum tellus. Sed id risus elit. Sed eget viverra orci. In eget rhoncus tellus. Duis ac diam a nisl imperdiet egestas in et dolor. Praesent vitae lorem ut mi posuere blandit. Ut lacinia euismod felis ac efficitur. Phasellus vel nunc elit.";

}]);
angular.module('app')
.directive('footer', function(){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: './directives/footer/index.html',
        controller: 'FooterController',
        controllerAs: 'footer'
    };
})
.controller('FooterController'
,['$scope', 
function($scope){

}]);
angular.module('app')
.directive('header', function(){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: './directives/header/index.html',
        controller: 'HeaderController',
        controllerAs: 'header'
    };
})
.controller('HeaderController'
,['$scope', 
function($scope){

}]);
angular.module('app')
.controller('Error404Controller'
,['$scope'
,function($scope){

    $scope.content = "Error 404";

}]);