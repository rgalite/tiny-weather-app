app.controller('ForecastController', function($scope, Cities, $log, $q) {
  $scope.cities = [];
  $scope.fetchingData = true;
  $scope.fetchingCities = true;

  /**
   * Event trigerred when the user selects a city
   * @param  {String} cityId
   */
  $scope.onCityClick = function(cityId) {
    $scope.fetchingData = true;
    $scope.selectedCity = _.find($scope.cities, {id: cityId});

    $q.all([Cities.getCurrentWeather(cityId), Cities.getForecast(cityId)])
    .then(function(data) {
      $scope.selectedCityWeather = data[0];
      $scope.selectedCityForecast = data[1];
    })
    .catch(function(error) {
      $log.error(error);
    })
    .finally(function() {
      $scope.fetchingData = false;
    });
  };

  Cities.getAll().then(function(response) {
    // Cities fetched successfully
    $scope.cities = _.map(response.data, function(city) {
      return {
        id: city.id,
        name: city.nm,
        longitude: city.lon,
        latitude: city.lat
      };
    });

    $scope.onCityClick($scope.cities[0].id);
    $scope.fetchingCities = false;
  }, function(response) {
    // Failed to get all cities
    $scope.fetchingCities = false;
  })
  .finally(function() {
    $scope.fetchingCities = false;
  });
});
