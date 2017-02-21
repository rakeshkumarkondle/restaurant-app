angular.module('restaurantApp', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {

        $routeProvider
            .when('/login', {
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            })
            .when('/home', {
                templateUrl: 'templates/Home.html',
                controller: 'HomeCtrl'
            })
            .otherwise({
                redirectTo: '/login'
            });
    }]).controller('HomeCtrl', function($scope, $rootScope, $http, $location, userDetails ) {
        
        $scope.logout = function(e) {
            e.preventDefault();
            localStorage.removeItem('userDetails');
            $location.path('/login');
        }
        if (localStorage.getItem('userDetails') !== undefined && localStorage.getItem('userDetails') !== null) {
            $scope.loginDetails = JSON.parse(localStorage.getItem('userDetails'));
        } else {
            $scope.loginDetails= userDetails.getLoginData();
            console.log($scope.loginDetails);
            localStorage.setItem('userDetails', JSON.stringify($scope.loginDetails));
        }
        $scope.checkFlag = function(res, reset) {
            var today = new Date();
            today.setHours(10, 0, 0, 0);
            angular.forEach(res, function(val) {
                if (!reset) {
                    if (val.users.indexOf($scope.loginDetails.data.id) > -1 && !val.isDisable) {
                        $scope.disableSelect = true;
                    } else if (val.isDisable) {
                        val.disableSelect = true;
                    }
                } else {
                    if ( val.users && val.users.length > 0) {
                        var dateComp = new Date(val.selectedDate);
                        dateComp.setHours(10, 0, 0, 0);
                        if (dateComp.getTime() == today.getTime()) {
                            $scope.disableSelect = true;
                            val.disableSelect = true;
                        } else {
                            val.disableSelect = true;
                        }
                    }
                }
                var checkCondition;
                var dateCheck = new Date();
                if (dateCheck.getHours() >= 23) {
                    val.todaySelected = true;
                    $scope.disableSelect = true;
                } else {
                    val.todaySelected = false;
                }
                if (reset) {
                    checkCondition = val.selectedDate !== undefined;
                } else {
                    checkCondition = val.selectedDate !== undefined && val.users.indexOf($scope.loginDetails.data.id) > -1;
                }
                if (checkCondition) {
                    var dateComp = new Date(val.selectedDate);
                    dateComp.setHours(10, 0, 0, 0);
                    if (dateComp.getTime() == today.getTime()) {
                        val.todaySelected = true;
                        $scope.selectedImage = val;
                    } else {
                        if (val.disableVisited) {
                            val.todaySelected = false;
                        }
                    }
                }
            });
            $rootScope.userDetails = res;
        }
        $scope.reload = function() {
            location.reload();
        }

        $scope.toggleDisable = function() {
            $http.put('/api/restaurants/showDisable', {
                showPreviousSelected: $scope.showPreviousSelected
            }).success(function(res) {

            });
        }
        $scope.selectHotel = function(userData) {
            var today = new Date();
            if (today.getHours() >= 23) {
                $scope.showModal = true;
            } else {
                today.setHours(10, 0, 0, 0)
                $http.put('/api/restaurants/', {
                    hotelData: userData,
                    user: $scope.loginDetails.data,
                    today: today
                }).success(function(res) {
                    $scope.checkFlag(res, false);
                });
            }

        };
        if ($scope.loginDetails.data.id == 6) {
            $scope.isAdmin = true;
            $http.get('/api/restaurants').then(function(res) {
                $scope.showPreviousSelected = res.data[0].disableVisited;
            }); 
        } else {
            var todayDate = new Date();
            if (todayDate.getHours() >= 23) {
                $scope.votingTimeDone = true;
                 $http.get('/api/resetRestaurants').then(function(res) {
                    $scope.checkFlag(res.data, true);
                }); 
            } else {
                if (todayDate.getDay() == 1) {
                    $http.get('/api/resetAllRestaurants').then(function(res) {
                        $scope.checkFlag(res.data, false);
                    }); 
                } else {
                     $http.get('/api/restaurants').then(function(res) {
                        $scope.checkFlag(res.data, false);
                    }); 
                }
            }
        }
    }).controller('loginCtrl', function($scope, $rootScope, $http, $location, userDetails) {
       
        if (localStorage.getItem('userDetails') !== undefined && localStorage.getItem('userDetails') !== null) {
            $location.path('/home');
        }
        $scope.signIn = function() {
            if ($scope.user != undefined) {
                $http.post('/api/login', $scope.user).then(function(res) {
                    if (res.errorMessage !== undefined) {
                        $scope.errorLogin = true;
                        $scope.error = res;
                    } else {
                        userDetails.setLoginData(res);
                        $location.path('/home');
                    }
                });
            }
        }
    }).service('userDetails', function() {
        this.data = {};
        this.setLoginData = function(data) {
            this.data = data;
        };
        this.getLoginData = function() {
            return this.data;
        }
    });