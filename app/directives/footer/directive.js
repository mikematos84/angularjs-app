angular.module('app')
.directive('footer', function(){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'app/directives/footer/index.html',
        controller: 'FooterController',
        controllerAs: 'footer'
    }
})
.controller('FooterController', ['$scope', function($scope){

}])