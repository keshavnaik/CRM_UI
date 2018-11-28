'use strict';

angular.module('letsService')
  .controller('FeedbackUpdateController', function ($scope,$window,$timeout,$cookies,TokenService,GetFeedbackTitleService,AddFeedbackQuestionService,UpdateFeedbackQuestionService) {

    // var adminUserId = $window.sessionStorage.getItem('loggedInUserId');
    //var adminUserScId = $window.sessionStorage.getItem('loggedInUserScId');

    var adminUserScId = $cookies.get('loggedInUserScId');
    

    function  getFeedBackTitleList() {
      $scope.loading = true;
      var lsToken = TokenService.getToken(adminUserScId);
      GetFeedbackTitleService.query({id:adminUserScId,token:lsToken}, function(data) {
        console.log(data);
        $scope.feedbackTitleList = data;
        $scope.feedbackTitleListErrorMsg = '';
        /*angular.forEach($scope.feedbackTitleList, function (val) {
          console.log($scope.feedbackTitleList[val].feedBackType);
          /!* if($scope.feedbackTitleList[val].feedBackType === null){
             $scope.feedbackTitleList[val].feedBackType = 'NA';
           }*!/
        });*/
        $scope.loading = false;
        console.log('feedback',data);
      }, function (err) {
        $scope.feedbackTitleListErrorMsg = err.data.message;
        $scope.feedbackTitleList = [];
        $scope.loading = false;
        console.log(err);
      });
    }
    getFeedBackTitleList();

    $scope.clearUpdateFeedbackMsg = function () {
      $scope.addFeddbackDescSuccess = '';
      $scope.feedback = {};
    };

    $scope.addFeedbackQuestion = function (feedbackDesc) {
      console.log(feedbackDesc);
      $scope.addFeddbackDescSuccess = '';
      var lsToken = TokenService.getToken(adminUserScId);
      /*console.log(feedbackDesc);
      console.log(adminUserScId);
      console.log(lsToken);*/
      var feedbackObj = {description: feedbackDesc.description,feedBackType:feedbackDesc.feedbackType,feedbackQuestionType:feedbackDesc.feedbackQuestionType,scId:adminUserScId};
      console.log(JSON.stringify(feedbackObj));
      AddFeedbackQuestionService.save({scId:adminUserScId,token:lsToken},feedbackObj, function(data) {
        console.log(data);
        $scope.addFeddbackDescSuccess = data.message;
        $scope.feedback = {};
        $scope.addFeedbackForm.$setPristine();
        // $scope.addFeedbackModalAlert = false;
        getFeedBackTitleList();
        $timeout(function() {
          $('#addFeedbackModal').modal('hide');
        }, 3000);
        console.log('addFeddbackDesc : ',data);
      }, function(err) {
        console.log(err);
        $scope.addFeddbackDescErrorMsg = err.data.message;
      });
    };


    $scope.updateFeedbackMsg = function (feedbackObj) {
      console.log(feedbackObj);
      $scope.updateFeddbackDescSuccess = '';
      $scope.feedback = {
        description : feedbackObj.description,
        feedBackListId : feedbackObj.feedBackListId
      };

    };

    $scope.updateFeedbackQuestion = function (feedbackObj) {
      $scope.updateFeddbackDescSuccess = '';
      var lsToken = TokenService.getToken(adminUserScId);
      var updateFeedbackReq = {
        description: feedbackObj.description,
        feedback_list_id: $scope.feedback.feedBackListId,
        scId: adminUserScId,
        status: 'update'
      };
      console.log(JSON.stringify(updateFeedbackReq));
      UpdateFeedbackQuestionService.save({scId:adminUserScId,token:lsToken},updateFeedbackReq, function(data) {
        console.log('update:-----',data);
        $scope.updateFeddbackDescSuccess = data.message;
        $scope.feedback = {};
        $scope.updateFeedbackForm.$setPristine();
        getFeedBackTitleList();
        $timeout(function() {
          $('#updateFeedbackModal').modal('hide');
        }, 3000);
      }, function(err) {
        console.log(err);
        $scope.updateFeddbackDescErrorMsg = err.data.message;
      });
    };


    $scope.deleteFeedbackMsg = function (feedbackObj) {
      var deleteStatus = $window.confirm('Are you sure to delete the question..?');
      if(deleteStatus){
        var lsToken = TokenService.getToken(adminUserScId);
        var deleteFeedbackReq = {
          feedback_list_id: feedbackObj.feedBackListId,
          scId: adminUserScId,
          status: 'delete'
        };
        console.log(JSON.stringify(deleteFeedbackReq));
        UpdateFeedbackQuestionService.save({scId:adminUserScId,token:lsToken},deleteFeedbackReq, function(data) {
          console.log('delete:-----',data);
          getFeedBackTitleList();
        }, function(err) {
          console.log(err);
        });
      }else{
        console.log('Deleting Cancelled');
      }

    };

  });
