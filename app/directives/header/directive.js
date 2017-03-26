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
.controller('HeaderController', ['$scope', function($scope){

    $scope.links = [
        {name: 'Home', sref: 'home', published: true},
        {name: 'About', sref: 'about', published: true},
        {name: 'Contact', sref: 'contact', published: true}
    ];
}])