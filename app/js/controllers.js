angular.module('bidding.controllers', []).
    controller('biddingController', function ($scope, $http, $filter) {

        $scope.readSettledCsv = function () {
            // http get request to read CSV file content
            $http.get('/app/csv/Settled.csv').success(function (data) {
                debugger
                var settledData = $scope.processData(data);
                var groupedData = $filter('groupBy')(settledData, "Customer");
                var keys = Object.keys(groupedData);
                for (customer = 0; customer < keys.length; customer++) {
                    var currentCustomer = groupedData[keys[customer]];
                    var winCount = 0;
                    var totalBits = currentCustomer.length;
                    var unusualrateCount = totalBits * 0.6;
                    for (var i = 0; i < currentCustomer.length; i++) {
                        var win = parseInt(currentCustomer[i].Win);
                        if (win != 0) {
                            winCount++;
                            if (winCount >= unusualrateCount)
                                currentCustomer[i].unUsualWin = true;
                        }
                    }
                }
                $scope.settledData = groupedData;
            });
        };
        $scope.readUnSettledCsv = function () {
            // http get request to read CSV file content
            $http.get('/app/csv/Unsettled.csv').success(function (data) {


                var unsettledData = $scope.processData(data);

                var groupedData = $filter('groupBy')(unsettledData, "Customer");
                var keys = Object.keys(groupedData);
                for (customer = 0; customer < keys.length; customer++) {
                    var currentCustomer = groupedData[keys[customer]];
                    var winCount = 0;
                    var totalBits = currentCustomer.length;
                    var unusualrateCount = totalBits * 0.6;
                    var averageBit = $scope.getAverageBitForCustomer(currentCustomer);
                    for (var i = 0; i < currentCustomer.length; i++) {
                        var win = parseInt(currentCustomer[i].Win);
                        var currentBit = parseInt(currentCustomer[i].Stake);
                        if (win != 0) {
                            winCount++;
                            if (winCount >= unusualrateCount)
                                currentCustomer[i].unUsualWin = true;
                            if (currentBit >= averageBit * 0.3) {
                                currentCustomer[i].riskUsualWin = true;
                            }
                            else if (currentBit >= averageBit * 0.1) {
                                currentCustomer[i].highUsualWin = true;
                            }

                        }
                    }
                }
                $scope.unsettledData = groupedData;
            });
        };
        $scope.getAverageBitForCustomer = function (customerData) {
            var bitValue = 0;
            for (var i = 0; i < customerData.length; i++) {
                bitValue += parseInt(customerData[i].Stake);
            }
            var averageBit = bitValue / customerData.length;
            return averageBit;
        }
        $scope.processData = function (settled) {
            // split content based on new line
            var allTextLines = settled.split(/\r\n|\n/);
            var headers = allTextLines[0].split(',');
            var lines = [];

            for (var i = 1; i < allTextLines.length; i++) {
                // split content based on comma
                var data = allTextLines[i].split(',');
                if (data.length == headers.length) {
                    var tarr = {};
                    for (var j = 0; j < headers.length; j++) {
                        tarr[headers[j]] = data[j];
                    }
                    lines.push(tarr);
                }
            }
            return lines;
        };


    }); 
