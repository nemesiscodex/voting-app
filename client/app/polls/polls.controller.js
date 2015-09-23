'use strict';

//Check if local storage is available
function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch (e) {
		return false;
	}
}

angular.module('workspaceApp')
	.controller('PollsCtrl', function ($scope, $http, $routeParams, $timeout, $location, Auth, $translate) {
		var id = $routeParams.id;

		$scope.location = $location.absUrl();

		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.isLoggedInAsync = Auth.isLoggedInAsync;
		$scope.isAdmin = Auth.isAdmin;
		$scope.currentUser = Auth.getCurrentUser();

		var saveImage = 'Save as Image';

		$translate('SAVE_IMAGE').then(function(saveImageTranslated){
			saveImage = saveImageTranslated;
		});


		var vm = this;

		require([
			'echarts',
			'echarts/chart/pie' // require the specific chart type
		], function (ec) {
			window.echarts = ec;
		});

		function drawChart() {
			vm.chart = echarts.init(angular.element('.chart.content')[0], {color: [
				'#616382', '#ADAEBD', '#82839B', '#47496C', '#2D2F51',
				'#333676', '#7F81B1', '#545894', '#191C59', '#080B3B',
				'#1790cf','#1bb2d8','#99d2dd','#88b0bb',
				'#1c7099','#038cc4','#75abd0','#afd6dd'
			]});

			var radius = (window.screen.availWidth >= 640)? '55%': '25%';

			var longText = function(obj, separator, maxLength){
				var result = [];
				var aux = '';
				var name = '';
				if(!maxLength)
					maxLength = 18;
				if(!separator)
					separator = '\n';
				if(typeof (obj) === 'string')
					name = obj;
				else name = obj.data.name;

				name.split(' ').map(function(el, idx, array){
					if(aux.length < maxLength){
						aux += el + ' ';
					}else{
						result.push(aux);
						aux = el + ' ';
					}

					if(idx === array.length - 1){
						result.push(aux);
					}
				});
				return result.join(separator)
			};

			var option = {
				title: {
					//text: $scope.poll.name,
					//subtext: 'Created at ' + $scope.poll.creationDate + ' by ' + $scope.poll.creator.name,
					x: 'center'
				},
				tooltip: {
					trigger: 'item',
					formatter: function(item){
						return  '<strong>' + longText(item[0], '<br>', 40) + '</strong> <br/> ' + longText(item[1], '<br>', 40) + ': ' + item[2] + ' (' + item[3] + '%)';
					}
				},
				legend: {
					orient: 'vertical',
					x: 'left',
					data: []
				},
				toolbox: {
					show: true,
					feature: {
						saveAsImage: {show: true, title: saveImage}
					}
				},
				series: [
					{
						name: $scope.poll.name,
						type: 'pie',
						itemStyle : {
							normal: {
								label: {
									formatter: longText,
									show: true,
									textStyle: {
										fontSize: '20',
										fontWeight: 'bolder'
									}
								}
							}
						},
						radius: radius,
						center: ['50%', '50%'],
						data: []
					}
				]
			};
			var item;
			for (var i = 0; i < $scope.poll.items.length; i++) {
				item = $scope.poll.items[i];
				//option.legend.data.push(item.name);
				option.series[0].data.push({value: (item.votes > 0 ? item.votes : '-'), name: item.name});
			}
			vm.chart.setOption(option);
			vm.chart.resize();
			$(window).resize(function(){
				if(vm.chart){
					vm.chart.resize();
				}
			});
		}

		if ($location.$$path === '/polls/mine')
			$http.get('/api/polls/mine').then(function (response) {
				$scope.polls = response.data.map(function(poll){
					poll.totalVoters = poll.items.reduce(function(sum, item){ return sum + item.votes; }, 0);
					return poll;
				}).sort(function(pollA, pollB){
					return pollB.totalVoters - pollA.totalVoters;
				});
			});
		else if(id == undefined){
			$scope.editable = true;
			$http.get('/api/polls').then(function (response) {
				console.log(response);
				$scope.polls = response.data.map(function(poll){
					poll.totalVoters = poll.items.reduce(function(sum, item){ return sum + item.votes; }, 0);
					return poll;
				}).sort(function(pollA, pollB){
					return pollB.totalVoters - pollA.totalVoters;
				});
			});
		}
		else{
			$scope.isLoggedInAsync(function(loggedIn){
				$scope.showResults = !loggedIn;
			});

			$scope.alreadyVoted = {};
			if (storageAvailable('localStorage')) {
				$scope.isLoggedInAsync(function(loggedIn){
					if(!loggedIn){
						window.next = $location.$$path;
						localStorage.setItem('next', $location.$$path);
					}else{
						localStorage.removeItem('next');
					}
				});
				$scope.alreadyVoted.get = function () {
					$scope.alreadyVoted.val = localStorage.getItem(id) == 'true';
					return $scope.alreadyVoted.val;
				};
				$scope.alreadyVoted.set = function (alreadyVoted) {
					$scope.alreadyVoted.val = alreadyVoted;
					localStorage.setItem(id, alreadyVoted)
				};
			} else { // in-memory
				$scope.isLoggedInAsync(function(loggedIn) {
					if (!loggedIn) {
						window.next = $location.$$path;
					} else {
						window.next = undefined;
					}
				});
				$scope.alreadyVoted.val = false;
				$scope.alreadyVoted.get = function () {
					return $scope.alreadyVoted.val;
				};
				$scope.alreadyVoted.set = function (alreadyVoted) {
					$scope.alreadyVoted.val = alreadyVoted
				};
			}


			$scope.alreadyVoted.get();

			$scope.vote = function(itemId){
				if($scope.isLoggedIn())
					$http.post('/api/polls/' + id + '/vote', {itemId: itemId})
						.then(function (response) {
							$scope.poll = response.data;
							console.log(response.data);
							$scope.alreadyVoted.set(true);
							$timeout(function(){
								$scope.$apply();
								drawChart();
							});
						});
			};

			$scope.delete = function(){
				if(confirm("Are you sure you want to delete '"+ $scope.poll.name +"'?\nThis operation cannot be undone."))
					$http.delete('/api/polls/' + id)
						.then(function () {
							$location.path('/polls/mine');
						});
			};

			$http.get('/api/polls/' + id).then(function (response) {
				$scope.poll = response.data;
				$translate('QUESTION').then(function(translate){
					$scope.twitterText = translate + ': ' +$scope.poll.name;
				});
				if($scope.poll.voters.indexOf($scope.currentUser._id) !== -1)
					$scope.alreadyVoted.set(true);
				$timeout(drawChart);
			});

				(function(d, s, id) {
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) return;
					js = d.createElement(s); js.id = id;
					js.src = "//connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v2.4&appId=682746471855920";
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));

		}

	});
