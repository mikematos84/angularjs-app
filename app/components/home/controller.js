app.controller('home.controller', ['$scope', function($scope){

    $scope.content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu nunc vestibulum, malesuada mi quis, interdum tellus. Sed id risus elit. Sed eget viverra orci. In eget rhoncus tellus. Duis ac diam a nisl imperdiet egestas in et dolor. Praesent vitae lorem ut mi posuere blandit. Ut lacinia euismod felis ac efficitur. Phasellus vel nunc elit.";

    $scope.list1 = [
        {name: 'Item 1', drag: true},
        {name: 'Item 2', drag: true},
        {name: 'Item 3', drag: true},
        {name: 'Item 4', drag: true},
        {name: 'Item 5', drag: true}
    ];

    $scope.list2 = [];

    $scope.remove = function(index){
        $scope.list1.push($scope.list2[index]);
        $scope.list2.splice(index,1);
    }

}]);