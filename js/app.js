var myApp = angular.module('myApp', []);


myApp.controller("myCtrl", function($scope) {
    $scope.myModel = {};
});

myApp.directive('myDirective', function() {
    return {
        templateUrl: 'file.html',
        replace: true,
        restrict: 'E',
        scope: {
            filename: '=ngModel'
        },

        link: function(scope, elm, attrs) {

            $(elm).fileupload({
                url: "https://upload.wistia.com/?access_token=b4f757614e9fd90137982d43b997137a42a5e9ff625462b941c01660564e2274",
                dataType: 'json',
                paramName: 'files[]',

                progressall: function(e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    scope.$apply(function() {
                        scope.progress = progress;
                    });

                },

                done: function(e, data) {
                    console.log(data);
                    var baseUrl = "https://fast.wistia.com/oembed/?url=";
                    var accountUrl = encodeURIComponent("https://dejijaye.wistia.com/medias/");
                    var mediaHashedId = data.result.hashed_id;

                    function getEmbeddedHtml(hashedId, callback) {
                      $.getJSON(baseUrl + accountUrl + hashedId + "&format=json&callback=?", callback);
                    }

                    scope.$apply(function() {
                      scope.filename = data.result.name;
                      scope.url = data.result.thumbnail.url;
                      scope.width = data.result.thumbnail.width;
                      scope.height = data.result.thumbnail.height;
                      angular.element(".iframe-html").append("<br />");

                      getEmbeddedHtml(mediaHashedId, function(json) {
                        angular.element(".iframe-html").append(json.html);
                      });

                    })

                }
            });
        }

    }
});