angular.module('bidding.controllers', []). 
    controller('biddingController', function ($scope, $http) {

        $scope.readSettledCsv = function () {
            // http get request to read CSV file content
            $http.get('/app/csv/Settled.csv').success(function (data) {
                $scope.settledDatas = $scope.processData(data);
                $scope.search = $scope.settledDatas[0].Customer;
            });
        };
        $scope.readUnSettledCsv = function () {
            // http get request to read CSV file content
            $http.get('/app/csv/Unsettled.csv').success(function (data) {
                $scope.unSettledDatas = $scope.processData(data);
            });
        };
        $scope.processData = function (settled) {
            // split content based on new line
            var allTextLines = settled.split(/\r\n|\n/);
            var headers = allTextLines[0].split(',');
            var lines = [];

            for (var i = 0; i < allTextLines.length; i++) {
                // split content based on comma
                var data = allTextLines[i].split(',');
                if (data.length == headers.length) {
                    var tarr = [];
                    for (var j = 0; j < headers.length; j++) {
                        tarr.push(data[j]);
                    }
                    lines.push(tarr);
                }
            }
            return lines;
        };

        
    }); 
