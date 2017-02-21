app.controller('home.controller', ['$scope', '$q', '$mdDialog', function($scope, $q, $mdDialog){

    var self = this;

    $scope.content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu nunc vestibulum, malesuada mi quis, interdum tellus. Sed id risus elit. Sed eget viverra orci. In eget rhoncus tellus. Duis ac diam a nisl imperdiet egestas in et dolor. Praesent vitae lorem ut mi posuere blandit. Ut lacinia euismod felis ac efficitur. Phasellus vel nunc elit.";

    $scope.list1 = [
        {name: 'Item 1', drag: true},
        {name: 'Item 2', drag: true},
        {name: 'Item 3', drag: true},
        {name: 'Item 4', drag: true},
        {name: 'Item 5', drag: true}
    ];
    $scope.list2 = [];
    var tempObject = {};

    $scope.remove = function(index){
        //$scope.list1.push($scope.list2[index]);
        $scope.list2.splice(index,1);
    }

    $scope.dropConfirmed = function(event, ui) {
        var object = angular.fromJson(ui.draggable[0].attributes['data-action'].nodeValue); 
        for(var i in $scope.list2){
            if(angular.equals($scope.list2[i], object)){
                $scope.list2[i] = tempObject;
                tempObject = {};
                return;
            }
        }
    };

    $scope.promptDrop = function(event, ui){
        var defer = $q.defer();
        $mdDialog.show({
            controller: DialogController,
            controllerAs: 'ctrl',
            locals: {
                event: event,
                ui: ui
            },
            templateUrl: 'app/components/home/dialog1.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        }).then(function(dialogBox){
            defer.resolve();
        }, function() {
            defer.reject();
        });

        return defer.promise;
    }

    function DialogController($scope, $mdDialog, locals){
        var item = angular.fromJson(locals.ui.draggable[0].attributes['data-action'].nodeValue);
        $scope.name = item.name;

        $scope.okay = function(){
            tempObject = item;
            tempObject.name = $scope.name;
            $mdDialog.hide();
        }

        $scope.cancel = function(){ 
            tempObject = {};
            $mdDialog.cancel();
        }
    }

}]);