var util = require('util');
var Tab = require('../client/tab').Tab;

var M2020Tab = function ()
{
  Tab.call(this);
};

util.inherits(M2020Tab, Tab);

M2020Tab.prototype.pageMode = 'single';
M2020Tab.prototype.parent = 'main';

M2020Tab.prototype.generateHtml = function ()
{
  return require('../../jade/tabs/m2020.jade')();
};

M2020Tab.prototype.angular = function (module) {
  module.controller('M2020Ctrl', ['$scope', '$element', '$routeParams', '$location', 'rpId', 'rpNetwork', '$rootScope', 'rpZipzap',
  function ($scope, $element, $routeParams, $location, $id, $network, $rootScope, $zipzap)
  {
    var SnapSwapAddress = 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q';

    $scope.mode = 'form';
    $scope.passwordSet = {};

    $scope.register = function() {

      var firstCall;

      // Create ripple wallet
      $id.register($scope.username, $scope.password1, function(key){
        if (!firstCall) {
          console.log('ripple account has been created',key);
          // Login to ripple wallet
          $id.login($scope.username, $scope.password1, function (err, blob) {
            // TODO this executes twice
            console.log('logged in');
            // Create zipzap account, fund the ripple wallet
            $zipzap.register($id.account,$scope.form);
            $zipzap.request(function(response){
              if (response.fund_hash) {
                console.log('zipzap account has been created');
                console.log('trusting...');
                // Trust SnapSwap
                var amount = '100/USD/' + SnapSwapAddress;
                var tx = $network.remote.transaction();
                tx.ripple_line_set($id.account, amount)
                  .on('proposed', function(res){
                    console.log('trusting proposed', res);
                    $scope.$apply(function () {
                      // Remember currency and increase order
                      var found;

                      for (var i = 0; i < $scope.currencies_all.length; i++) {
                        if ($scope.currencies_all[i].value.toLowerCase() == 'usd') {
                          $scope.currencies_all[i].order++;
                          found = true;
                          break;
                        }
                      }

                      if (!found) {
                        $scope.currencies_all.push({
                          "name": currency,
                          "value": currency,
                          "order": 1
                        });
                      }
                    });

                    // Add SnapSwap as a contact
                    $scope.userBlob.data.contacts.unshift({
                      name: 'SnapSwap',
                      address: SnapSwapAddress
                    });

                    $scope.mode = 'registerSuccess';
                  })
                  .on('error',function(err){
                    console.log('error',err);
                  })
                  .submit();
              } else {
                console.log('error',response);
              }
            })
          })
        }

        firstCall = true;
      });

      $scope.mode = 'registerProgress';
    }
  }]);
};

module.exports = M2020Tab;
