'use strict';

(function() {
  describe('Zips', function() {
    //Initialize global variables
    var zips, 
      httpBackend;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));


    beforeEach(inject(function(_Zips_, $httpBackend) {
      zips = _Zips_;
      httpBackend = $httpBackend;
    }));

    it('should filter given zipcodes by income', function() {
      httpBackend.whenGET('/zip/94133').respond('50000');
      httpBackend.whenGET('/zip/87114').respond('30000');

      var filtered = [];
      zips.filteredZipCodes([94133, 87114], ['34512', '78212'], function(zipcode) {
        filtered.push(zipcode);
        expect(filtered.length).toEqual(1);
        expect(filtered[0]).toEqual(94133);
      });

      httpBackend.flush();
    });


  });
})();