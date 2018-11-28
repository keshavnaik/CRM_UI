'use strict';

angular.module('letsService')
	.controller('SupportPageController', function($scope,$window,$rootScope,$timeout,$filter,ngTableParams,$cookies){

	var adminUserId = $cookies.get('loggedInUserId');
    var adminUserScId = $cookies.get('loggedInUserScId');
    var adminUserRole = $cookies.get('loggedInUserRole');

});