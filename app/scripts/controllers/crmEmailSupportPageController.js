'use strict'

angular.module('letsService')
  .controller('EmailSupportPageController', function($scope,$http,$window,$rootScope,$timeout,$filter,ngTableParams,$cookies,TokenService,SupportQuestionEmailService,TimeSlotSelected,PostTicketDetailsService){

  var adminUserId = $cookies.get('loggedInUserId');
  var adminUserScId = $cookies.get('loggedInUserScId');
  var adminUserRole = $cookies.get('loggedInUserRole');
  var adminUserEmail = $cookies.get('loggedInEmail');
  var adminDealerName = $cookies.get('loggedInDealerName');
  var logInUserName = $cookies.get('loggedInUserName')

  $scope.ticktFieldsObj = {
    'requesterEmail' : adminUserEmail,
    'loginName' : logInUserName,
    'dealerName' : adminDealerName
  };
    
    // var selFile; 
    // $(function() {
    //   selFile = document.getElementById('attachmentFile');
    //   // console.log(selFile);
    //   if(selFile.addEventListener) {
    //     selFile.addEventListener('change', filePicked, false);
    //   }
    // });

    // var sFilename;
    // function filePicked(oEvent) {
    //   var oFile = oEvent.target.files[0];
    //   sFilename = oFile.name;
    //   console.log(sFilename);
    // }

    $scope.category = [{"categoryName":"Admin Portal", "value":"Admin Portal"},{"categoryName":"Caller Portal", "value":"Caller Portal"}];
    $scope.categoryName = function(categoryObj){
      if(categoryObj === 'Admin Portal'){
        $scope.subCategory = [{"fieldName":"Caller Performance", "value":"Caller Performance"},{"fieldName":"SC Performance Stats", "value":"SC Performance Stats"},
          {"fieldName":"PSF Performance", "value":"PSF Performance"},{"fieldName":"Insurance Performance","value":"Insurance Performance"},{"fieldName":"SMS", "value":"SMS"},
          {"fieldName":"Manage Profile", "value":"Manage Profile"},{"fieldName":"Calling Report", "value":"Calling Report"},{"fieldName":"Overall Report", "value":"Overall Report"}, 
          {"fieldName":"Update PSF", "value":"Update PSF"}, {"fieldName":"Update Date of Sale", "value":"Update Date of Sale"},{"fieldName":"Upload and Assign", "value":"Upload and Assign"},
          {"fieldName":"Upload History", "value":"Upload History"}, {"fieldName":"Assign History", "value":"Assign History"}]; 
      } else if(categoryObj === 'Caller Portal'){
        $scope.subCategory = [{"fieldName":"Dashboard", "value":"Dashboard"},{"fieldName":"SMS", "value":"SMS"},{"fieldName":"PSF Service", "value":"PSF Service"}, 
          {"fieldName":"Others","value":"Others"},{"fieldName":"Stats", "value":"Stats"}, {"fieldName":"Insurance Calling Data", "value":"Insurance Calling Data"}, {"fieldName":"Sales","value":"Sales"},
          {"fieldName":"Upload and Assign", "value":"Upload and Assign"}, {"fieldName":"Upload History", "value":"Upload History"}, {"fieldName":"Assign History", "value":"Assign History"}];
      } else{
        $scope.subCategory = [];
      }
    };

    var userName = 'chinmayee.d@letsservice.in';
    var password = 'Ticket@4492';
    // var emailId = 'arun.billur@gmail.com';
    var authorizationBasic = window.btoa(userName + ':' + password);
    $scope.raiseTicket = function(ticketObj){
      $scope.loaderIcon = true;
      console.log(ticketObj);
      var selectedFile = ticketObj.attachmentFile;
      console.log(selectedFile);
      $http({
        method: 'POST',
        url: 'https://letsservicetechnolgy.freshdesk.com/api/v2/tickets',
        data: {
          "subject": ticketObj.subject,
          "description": ticketObj.description+ '<br/><br/>'+ 'Please find the attachment here'+'<br/>'+selectedFile, 
          "email": adminUserEmail,
          "priority": 1,
          "custom_fields" : { "cf_admin": ticketObj.selectedCategory, "cf_caller":ticketObj.selectedSubCategory, "cf_service":"Service", "cf_dealer_name":ticketObj.dealerName, "cf_requester_name":ticketObj.loginName,"cf_mobile":ticketObj.mobile},
          "status": 2
          },
        headers: {
          "Content-Type" : "application/json",
          'Authorization': 'Basic ' + authorizationBasic
        }
      }).success(function(data, config, status, headers){
        console.log(data);
        $scope.loaderIcon = false;
        alert("Your ticket is created successfully.");
        var postTicketObj = {
          'scId':adminUserScId,
          'callerId':adminUserId,
          'email':adminUserEmail,
          'ticketId':data.id,
          'attachment':selectedFile
        }
        postTicketDeatils(postTicketObj);
        
      }).error(function(data){
        console.log(data);
        $window.alert(data.errors[0].message);
        $scope.loaderIcon = false;
      })
      $scope.raiseTicketForm.$setPristine();
      $scope.ticktFieldsObj = {
           'requesterEmail' : adminUserEmail,
           'loginName' : logInUserName,
           'dealerName' : adminDealerName
      };
    }

    $scope.create = false;
    $scope.view = false;
    $scope.createViewTicket = function(createOrView){
      $scope.loaderIcon = true;
      $scope.ticketDetailsErrorMsg = '';
      if(createOrView === 'createTicket'){
        $scope.create = true;
        $scope.view = false;
        $scope.loaderIcon = false;
      } else if(createOrView === 'viewTicket'){
        $scope.create = false;
        $scope.view = true;
        $http({
        method: 'GET',
        url: 'https://letsservicetechnolgy.freshdesk.com/api/v2/tickets?email='+adminUserEmail, //?email=deepak@gmail.com
        headers: {
          "Content-Type" : "application/json",
          'Authorization': 'Basic ' + authorizationBasic
        }
      }).success(function(data){
        $scope.ticketDetails = data;
        if($scope.ticketDetails.length <1){
           $scope.ticketDetailsErrorMsg = 'No Data Available..!';
        }else if($scope.ticketDetails.length >0){
          $scope.ticketDetailsErrorMsg = '';
        }
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
         else if($scope.ticketDetails[i].status === 7){
           $scope.ticketDetails[i].status = 'Waiting on Third Party';
         } else {
           $scope.ticketDetails[i].status = 'New Request';
         }
        }
      }).error(function(data){
        $scope.loaderIcon = false;
        $window.alert(data.errors[0].message);
        console.log(data);
      })
      }
    }

    function postTicketDeatils(postRequest){
      console.log(JSON.stringify(postRequest));
      var lsToken = TokenService.getToken(adminUserScId);
      PostTicketDetailsService.save({scId:adminUserScId,token:lsToken},postRequest,function(data) {
        console.log('Post Ticket Details to backend::',data);
        $scope.postTicketRessponce = data;
      }, function(err) {
        console.log(err);
        //$scope.postTicketRessponce = err.data.message;
      });
    };

    $scope.getParticularTicket = function(updatingObj){
      $scope.successMsg = '';
      $scope.errorMsg = '';
      console.log(updatingObj);
      // $scope.updateTicketSubject = updatingObj.subject;
      // $scope.updateTicketId = updatingObj.id;
      // $scope.updateDescription = updatingObj.description_text;
      $scope.updateObj = {
        'updatedId':updatingObj.id,
        'updatedSubject':updatingObj.subject,
        'updatedDescription':updatingObj.description_text + "\n\n---- New update here ----"
      };
    };


    $scope.updateTicket = function(updateTicketObj){
      console.log(updateTicketObj);
      $scope.successMsg = '';
      $http({
        method: 'PUT',
        url: 'https://letsservicetechnolgy.freshdesk.com/api/v2/tickets/'+updateTicketObj.updatedId,
        data: {
          "subject": updateTicketObj.updatedSubject,
          "description": updateTicketObj.updatedDescription+ '<br/><br/>'+ 'Please find the attachment here' +'<br/>'+updateTicketObj.updateAttachmentFile 
          },
        headers: {
          "Content-Type" : "application/json",
          'Authorization': 'Basic ' + authorizationBasic
        }
      }).success(function(data, config, status, headers){
        console.log(data);
        $scope.errorMsg = '';
        $scope.loaderIcon = false;
        $scope.successMsg = 'Your ticket is updated successfully.';
        $scope.updateTicketForm.$setPristine();
        $scope.updateObj = '';
        $timeout(function() {
          $('#updateTicketModal').modal('hide');
        }, 3000);
        $scope.createViewTicket('viewTicket');
      }).error(function(data){
        console.log(data);
        $scope.successMsg = '';
        $scope.errorMsg = data.errors[0].message;
        $scope.loaderIcon = false;
      })
    }

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

});