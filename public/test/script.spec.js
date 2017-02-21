describe('restaurantApp Suite', function() {
	var userDetailsService, homeController, loginController, $controller, $httpBackend, $loginScope,
	 userObj = {
		"users":[
			{"id":1,"name":"hungryworker1"},
			{"id":2,"name":"hungryworker2"},
			{"id":3,"name":"hungryworker3"},
			{"id":4,"name":"hungryworker4"},
			{"id":5,"name":"hungryworker5"},
			{"id":6,"name":"process_facilitator"}
		]
	},
	restaurants = [{
	    "id": 0,
	    "name": "Best Western",
	    "isDisable": false,
	    "image": "images/image1.jpg",
	    "users": [],
	    "disableVisited": true
	}];
	
	beforeEach(angular.mock.module('restaurantApp'));

	beforeEach(inject(function(_$controller_, _$rootScope_, _$httpBackend_, $q, _userDetails_) {

    	userDetailsService = _userDetails_;
    	$controller = _$controller_;
    	$rootScope = _$rootScope_;
    	$httpBackend = _$httpBackend_;
    	$scope = $rootScope.$new();
    	localStorage.setItem('userDetails', JSON.stringify({userName: 'test', pwd : 'test',data:{id:1}}));
    	$httpBackend.whenGET('/api/restaurants').respond(200, restaurants);
    	$httpBackend.whenGET('/api/resetRestaurants').respond(200, restaurants);
    	homeController = $controller('HomeCtrl', { $scope: $scope });

    	$loginScope = $rootScope.$new();
    	loginController = $controller('loginCtrl', { $scope: $loginScope });
    	
  	  }));

	  it('user service should exist', function() {
	    expect(userDetailsService).toBeDefined();
	  });

	  it('setLoginData should set data property', function(){

	  		userDetailsService.setLoginData("mock");
	  		expect(userDetailsService.data).toEqual("mock"); 
	  });

	  it('getloginData should get login details', function(){
	  		userDetailsService.setLoginData("mockUser");
	  		expect(userDetailsService.getLoginData()).toEqual("mockUser");
	  });

	  it('should set login details from locastorage', function(){
	  		expect($scope.loginDetails).toEqual({userName: 'test', pwd : 'test',data:{id:1}});
	  });

	  it('$scope.setFlag should set user details to rootscope', function(){
	  	var obj = [{
			    "id": 0,
			    "name": "Best Western",
			    "isDisable": false,
			    "image": "images/image1.jpg",
			    "users": [],
			    "disableVisited": true
			}];
	  	$scope.checkFlag(obj);
	  	expect($rootScope.userDetails).toEqual(obj);	

	  });

	  it('loginController signin', function(){
	  		$httpBackend.whenPOST('/api/login').respond(200, userObj);
	  		$loginScope.user = {};
	  		spyOn(userDetailsService,'setLoginData');
	  		$loginScope.signIn();
	  		$httpBackend.flush();
	  		expect(userDetailsService.setLoginData).toHaveBeenCalled();

	  });



});