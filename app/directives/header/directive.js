angular.module('app')
.directive('header', function(){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'app/directives/header/index.html',
        controller: 'HeaderController',
        controllerAs: 'header'
    }
})
.controller('HeaderController', function($scope){

})