angular.module('app')
.controller('ResumeController'
,['$scope'
,function($scope, $stateParams){

    var self = this;

    $scope.content = "This is my resume";

}]);