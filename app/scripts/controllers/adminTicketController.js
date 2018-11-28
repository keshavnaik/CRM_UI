'use strict';

angular.module('letsService')
  .controller('AdminTicketViewController', function ($scope,$sce,serviceURL,$filter,$cookies,$rootScope,$http,$window,TokenService,GetSuperAdminDealerListService) {

  	var adminUserId = '369';
  	function getSuperAdminDealerList() {
      var lsToken = TokenService.getToken(adminUserId);
      GetSuperAdminDealerListService.query({logInId:adminUserId,token:lsToken}, function(data) {
        $scope.dealerList = data;
        angular.forEach($scope.dealerList, function(val,index){
        	console.log($scope.dealerList[index].email);
        	var emailObj = {
        		'email':$scope.dealerList[index].email
        	};
        	if(emailObj.email != 'No email'){
        		$scope.calculateTicketsStats(emailObj,$scope.dealerList[index].scName);
        		$scope.loaderIcon = true;
        	}
        })
        //console.log('dealerList +++',data);
      }, function(err) {
        $scope.dealerListErrorMsg = err.data.message;
      });
    }
    getSuperAdminDealerList();


    var userName = 'chinmayee.d@letsservice.in';
    var password = 'Ticket@4492';
    var authorizationBasic = window.btoa(userName + ':' + password);

    $scope.dealerTicketStats = [];
    $scope.statsCount = 0;
    $scope.openTicketData = [];
    $("#openTicketModal").modal('hide');
    $scope.calculateTicketsStats = function(scEmail,scDisplayName){
      $scope.openTicketData = [];
    	$scope.loaderIcon = true;
    	console.log(scEmail,scDisplayName);
    	$scope.statsCount = 0;
    	console.log('Count to zero',$scope.statsCount);
    	$http({
    		method: 'GET',
        	url: 'https://letsservicetechnolgy.freshdesk.com/api/v2/tickets?email='+scEmail.email, //?+scEmail.email
        	headers: {
        		'Content-Type' : "application/json",
          		'Authorization': 'Basic ' + authorizationBasic
        	}
      	}).success(function(data){
      		//$scope.successMsg = true;
      		$scope.statsTicketDetails = data;
      		//console.log('Ticket length',$scope.statsTicketDetails.length);
      		if($scope.statsTicketDetails.length > 0){
	      		angular.forEach($scope.statsTicketDetails, function(val,index){
	      			if($scope.statsTicketDetails[index].status === 2 || $scope.statsTicketDetails[index].status === 6 || $scope.statsTicketDetails[index].status === 7){
	      				$scope.statsCount = $scope.statsCount+1;
                if(scDisplayName === 'open'){
                $scope.openTicketData.push($scope.statsTicketDetails[index]);
                }
	      				//console.log('Inside loop'+index,$scope.statsCount);
	      			}
	      		})
	      	}
      		console.log('Open Tickets Count',$scope.statsCount);
          if(scDisplayName !== 'open'){
            $scope.dealerTicketStats.push({'dealerName':scDisplayName, 'openTicketCount':$scope.statsCount, 'email':scEmail.email});
          }
          if(scDisplayName === 'open'){
            if($scope.openTicketData.length >0){
              $("#openTicketModal").modal('show');
              for(var i=0; i<$scope.openTicketData.length; i++){
            if($scope.openTicketData[i].status === 2){
              $scope.openTicketData[i].status = 'Open';
            } else if($scope.openTicketData[i].status === 3){
              $scope.openTicketData[i].status = 'Pending';
            }
            else if($scope.openTicketData[i].status === 4){
              $scope.openTicketData[i].status = 'Resolved';
            }
            else if($scope.openTicketData[i].status === 5){
              $scope.openTicketData[i].status = 'Closed';
            }
            else if($scope.openTicketData[i].status === 6){
              $scope.openTicketData[i].status = 'Assigned to Tech team';
            }
            else if($scope.openTicketData[i].status === 7){
              $scope.openTicketData[i].status = 'Waiting on Third Party';
            } else {
              $scope.openTicketData[i].status = 'New Request';
            }
          }
            }
          }
      		console.log($scope.dealerTicketStats);
      		$scope.statsCount = 0;
	        $scope.loaderIcon = false;
	        console.log('Ticket details for count',$scope.statsTicketDetails);
          console.log('OPEN TICKETS DATA ::',$scope.openTicketData);
      	}).error(function(data){
      		$scope.loaderIcon = false;
      		// $scope.noTicketMsg = 'There are no tickets raised from this dealer';
        	//$window.alert(data.errors[0].message);
        	console.log(data);
      	})
    }

    $scope.retrieveTickets = function(ticketObj){
    	console.log(ticketObj);
    	$scope.loaderIcon = true;
    	$http({
    		method: 'GET',
        	url: 'https://letsservicetechnolgy.freshdesk.com/api/v2/tickets?email='+ticketObj.selectedEmail, //?email=deepak@gmail.com
        	headers: {
        		'Content-Type' : "application/json",
          		'Authorization': 'Basic ' + authorizationBasic
        	}
      	}).success(function(data){
      		$scope.successMsg = true;
      		$scope.ticketDetails = data;
      		$scope.noTicketMsg = false;
	        $scope.loaderIcon = false;
	        console.log('Ticket details',$scope.ticketDetails);
	        for(var i=0; i<$scope.ticketDetails.length; i++){
	          if($scope.ticketDetails[i].status === 2){
	            $scope.ticketDetails[i].status = 'Open';
	          } else if($scope.ticketDetails[i].status === 3){
	            $scope.ticketDetails[i].status = 'Pending';
	          }
	          else if($scope.ticketDetails[i].status === 4){
	            $scope.ticketDetails[i].status = 'Resolved';
	          }
	          else if($scope.ticketDetails[i].status === 5){
	            $scope.ticketDetails[i].status = 'Closed';
	          }
	          else if($scope.ticketDetails[i].status === 6){
	          	$scope.ticketDetails[i].status = 'Assigned to Tech team';
	          }
	          else{
	          	$scope.ticketDetails[i].status = 'Waiting on Third Party';
	          }
	        }
	        $scope.ticketObj = {};
	        $scope.retrieveTicketsForm.$setPristine();
      	}).error(function(data){
      		$scope.loaderIcon = false;
      		$scope.successMsg = false;
      		$scope.noTicketMsg = 'There are no tickets raised from this dealer';
        	//$window.alert(data.errors[0].message);
        	console.log(data);
      	})
    };

    $scope.retrieveTicketsManually = function(ticketData){
    	//console.log(ticketData);
    	$scope.loaderIcon = true;
    	$http({
    		method: 'GET',
        	url: 'https://letsservicetechnolgy.freshdesk.com/api/v2/tickets?email='+ticketData.ticketEmail, //?email=deepak@gmail.com
        	headers: {
        		'Content-Type' : "application/json",
          		'Authorization': 'Basic ' + authorizationBasic
        	}
      	}).success(function(data){
      		//console.log(data);
      		$scope.successMsg = true;
      		$scope.noTicketMsg = false;
      		$scope.ticketDetails = data;
	        $scope.loaderIcon = false;
	        console.log('Ticket details',$scope.ticketDetails);
	        for(var i=0; i<$scope.ticketDetails.length; i++){
	          if($scope.ticketDetails[i].status === 2){
	            $scope.ticketDetails[i].status = 'Open';
	          } else if($scope.ticketDetails[i].status === 3){
	            $scope.ticketDetails[i].status = 'Pending';
	          }
	          else if($scope.ticketDetails[i].status === 4){
	            $scope.ticketDetails[i].status = 'Resolved';
	          }
	          else if($scope.ticketDetails[i].status === 5){
	            $scope.ticketDetails[i].status = 'Closed';
	          }
	          else{
	          	$scope.ticketDetails[i].status = 'Assigned to Tech team';
	          }
	        }
	        $scope.ticketData = {};
	        $scope.retrieveTicketsManuallyForm.$setPristine();
      	}).error(function(data){
      		$scope.loaderIcon = false;
      		$scope.successMsg = false;
      		$scope.noTicketMsg = 'There are no tickets raised from this user';
        	// $window.alert(data.errors[0].message);
        	console.log(data);
      	})
    };

    $scope.getParticularTicketFullDetails = function(updatingObj){
    	$scope.loaderIcon = true;
      	console.log(updatingObj);
      	$scope.updateObj = {
        	'updatedId':updatingObj.id,
        	'updatedSubject':updatingObj.subject,
        	'updatedDescription':updatingObj.description_text
      	};
		$http({
    		method: 'GET',
        	url: 'https://letsservicetechnolgy.freshdesk.com/api/v2/tickets/'+updatingObj.id+'/conversations',
        	headers: {
        		'Content-Type' : "application/json",
          		'Authorization': 'Basic ' + authorizationBasic
        	}
      	}).success(function(data){
      		//console.log(data);
      		$scope.ticketFullDetails = data;
	        $scope.loaderIcon = false;
	        console.log('Ticket details',$scope.ticketFullDetails);
	        if($scope.ticketFullDetails.length === 0){
	        	$scope.noConversationMsg = 'There are no conversations for this ticket yet.';
	        } else{
	        	$scope.noConversationMsg = '';
	        }
      	}).error(function(data){
      		$scope.loaderIcon = false;
        	$window.alert(data.errors[0].message);
        	console.log(data);
      	})
    };

  })