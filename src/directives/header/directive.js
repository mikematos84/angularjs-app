angular.module('app')
    .directive('header', function () {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: './directives/header/index.html',
            controller: 'HeaderController',
            controllerAs: 'header'
        };
    })
    .controller('HeaderController'
    , ['$scope',
        function ($scope) {

        }]);