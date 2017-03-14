angular.module('app')
.controller('HeaderController', ['$scope', function($scope){

    $scope.links = [
        {name: 'Home', sref: 'home', published: true},
        {name: 'About', sref: 'about', published: true},
        {name: 'Contact', sref: 'contact', published: true}
    ];
}])