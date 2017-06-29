angular.module('app')
    .controller('HomeController', [
        '$scope',
        HomeController]);

function HomeController(
    $scope,
    $stateParams
) {
    var self = this;

    $scope.content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu nunc vestibulum, malesuada mi quis, interdum tellus. Sed id risus elit. Sed eget viverra orci. In eget rhoncus tellus. Duis ac diam a nisl imperdiet egestas in et dolor. Praesent vitae lorem ut mi posuere blandit. Ut lacinia euismod felis ac efficitur. Phasellus vel nunc elit.";

    $scope.complete = function () {
        sco.set('cmi.core.lesson_status', 'completed');
    };

    $scope.exit = function () {
        sco.quit();
    };

    $scope.objective = function () {
        var jsonString = JSON.stringify({
            "mike": {
                "matos": {
                    "is": "awesome"
                },
                "has": [
                    { "hello": "there" },
                    { "mike": "mike" }
                ]
            }
        });

        sco.set('cmi.suspend_data', jsonString);
    };

    $scope.getObjective = function () {
        var data = sco.get('cmi.suspend_data');
        console.log(data);
    };
}