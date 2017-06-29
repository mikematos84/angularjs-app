angular.module('app')
    .controller('Error404Controller', [
        '$scope',
         Error404Controller]);

function Error404Controller(
    $scope
) {
    $scope.content = "Error 404";
}