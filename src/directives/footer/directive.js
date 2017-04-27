angular.module('app')
.directive('footer', function(){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: './directives/footer/index.html',
        controller: 'FooterController',
        controllerAs: 'footer'
    }
})
.controller('FooterController', function($scope){

})