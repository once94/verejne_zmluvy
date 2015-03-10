var app = angular.module("app", ['ui.bootstrap'])
	.controller("officeController", function($scope, $http, $modal) {

		$scope.sortType = 'price_sum.amount'; // set the default sort type
		$scope.sortReverse = true;  // set the default sort order

		$scope.reverse = function(type){
			if($scope.sortType === type){
				$scope.sortReverse = !$scope.sortReverse;
			}
			else {
				$scope.sortReverse = false;
				$scope.sortType = type;
			}
		};

		$scope.average = function(data){
			return data.price_sum.amount / data.count;
		};

		$scope.launch = function(data){
			var modalInstance = $modal.open({
				templateUrl: 'myModalContent.html',
				controller: 'ModalController',
				size: 'lg',
				resolve: {
					data: function () {
						return data;
					}
				}
			});
		};

		$scope.suppliers = null;
		$http.get("data/pb_dod_fak.json")
			.success(function(data){
				$scope.suppliers = data;
			});
	})
	.controller("ModalController", function($scope, $modalInstance, data){

		$scope.sortType = 'price'; // set the default sort type
		$scope.sortReverse = true;  // set the default sort order

		$scope.supplier = data.supplier;
		$scope.price_sum = data.price_sum;
		$scope.invoices = data.invoice;

		$scope.reverse = function(type){
			if($scope.sortType === type){
				$scope.sortReverse = !$scope.sortReverse;
			}
			else {
				$scope.sortReverse = false;
				$scope.sortType = type;
			}
		};

		$scope.done = function () {
			$modalInstance.dismiss('done');
		};

		 $scope.countWatchers = function (scope) {
            var watchers = (scope.$$watchers) ? scope.$$watchers.length : 0;
            var child = scope.$$childHead;
            while (child) {
                watchers += (child.$$watchers) ? child.$$watchers.length : 0;
                child = child.$$nextSibling;
            }
            return watchers;
        };

        var dateFromString = function(date){
        	var dt1 = date.split('.'),
        		one = new Date(dt1[2], dt1[1], dt1[0]);

        	return one;
        };

        $scope.dateDiff = function(data){
        	var millisecondsPerDay = 1000 * 60 * 60 * 24;
        	var millisBetween = dateFromString(data.date_published).getTime() - dateFromString(data.date_signed).getTime();
        	var days = millisBetween / millisecondsPerDay;
    
        	return Math.floor(days);
        };

        $scope.signedDate = function(data){
        	return dateFromString(data.date_signed);
        };

        $scope.publishedDate = function(data){
			return dateFromString(data.date_published);
        };
	})
	.directive('blackCircles', function() {
		return {
			restrict: 'EA', 
			replace: true,
			link: function(scope, elem, attrs) {
				try {
					var dataset = [],
					    i = 0;

				    var num = parseInt(scope.num);
					    
					for(i=0; i<6; i++){
					    dataset.push(Math.round(Math.random()*100));
					}        

					var sampleSVG = d3.select(elem[0])
					    .append("svg")
					    .attr("width", $(elem[0]).width())
					    .attr("height", 75);    
					    
					sampleSVG.selectAll("circle")
					    .data(dataset)
					    .enter().append("circle")
					    .style("stroke", "gray")
					    .style("fill", "black")
					    .attr("r", 25)
					    .attr("cx", function(d, i){return (i+1)*80})
					    .attr("cy", 35);
				} catch (e) {
					console.log(e);
				}
			}
		};
	});