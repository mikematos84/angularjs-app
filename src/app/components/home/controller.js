angular.module('app')
    .controller('HomeController', [
        '$scope',
        '$stateParams',
        '$http',
        HomeController]);

function HomeController(
    $scope,
    $stateParams,
    $http
) {
    var self = this;

    $scope.content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu nunc vestibulum, malesuada mi quis, interdum tellus. Sed id risus elit. Sed eget viverra orci. In eget rhoncus tellus. Duis ac diam a nisl imperdiet egestas in et dolor. Praesent vitae lorem ut mi posuere blandit. Ut lacinia euismod felis ac efficitur. Phasellus vel nunc elit.";

    /**
     * Simple example of importing data from json. 
     */
    $http.get('data/test.json')
        .then(function success(resp){ 
            console.log(resp.data);
        }, function error(resp){
            console.log(resp);
        });
}