'use strict';

(function() {
  describe('medianIncome', function() {
    //Initialize global variables
    var medianIncome, 
      httpBackend;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));


    beforeEach(inject(function(_medianIncome_, $httpBackend) {
      medianIncome = _medianIncome_;
      httpBackend = $httpBackend;
    }));

    it('should filter given zipcodes by income', function() {
      httpBackend.whenGET('/medianincome?rangeInc=34512&rangeInc=78212&zipcodes=94133&zipcodes=87114').respond([{zipcode:87114, medianIncome: 34000}]);

      medianIncome.filterByZipcodes([94133, 87114], ['34512', '78212'], function(filtered) {
        expect(filtered.length).toEqual(1);
        expect(filtered[0].zipcode).toEqual(87114);
        expect(filtered[0].medianIncome).toEqual(34000);
      });

      httpBackend.flush();
    });


  });
})();