public class StreetMapController {
    @AuraEnabled(cacheable=true)
    public static String getLatLong(String locationName) {
        String appId = '08b77d57';

        String apiKey = '918207f9fb66bab258a1ba2940a4a3c8';

        String endpoint =
            'https://api.traveltimeapp.com/v4/geocoding/search?query='
            + EncodingUtil.urlEncode(locationName, 'UTF-8');

        Http http = new Http();

        HttpRequest request = new HttpRequest();

        request.setEndpoint(endpoint);

        request.setMethod('GET');

        request.setHeader('X-Application-Id', appId);

        request.setHeader('X-Api-Key', apiKey);

        request.setHeader('Accept', 'application/json');

        try {

            HttpResponse response =
                http.send(request);

            System.debug(
                'Response Body: ' +
                response.getBody()
            );

            System.debug(
                'Status Code: ' +
                response.getStatusCode()
            );

            if (response.getStatusCode() == 200) {

                return response.getBody();

            } else {

                throw new AuraHandledException(
                    'API Error: ' +
                    response.getStatus()
                );
            }

        } catch (Exception e) {

            throw new AuraHandledException(
                'Callout Error: ' +
                e.getMessage()
            );
        }
    }
}