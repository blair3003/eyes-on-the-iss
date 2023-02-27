# Eyes on the ISS

Find out the best time to see the ISS in the sky above you!

## How it works

The app fetches the ISS location data from a NASA API and caches it in local storage. If the data in local storage is not stale, it will be loaded from there instead.

The user will then provide a location, or their device will provide one automatically, and the app will provide a list of upcoming passes of the ISS over this location.

The upcoming passes of the ISS will be displayed as timeslots with information including the time of day, the direction to look in, and the predicted quality of the sighting.

The user can then use these listings to determine a suitable time to try and catch a glimpse of the ISS in the sky above them.

## Requirements

- [Satellite Situation Center](https://sscweb.gsfc.nasa.gov/WebServices/REST/) (NASA API)
- NASA API Key - BpWznLX4H1bH2IQEFWVeTdqpm9UD6xM6MWoIeDTl (optional?)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition)
- [Geocoding API](https://openweathermap.org/api/geocoding-api)

## Resources

- https://sscweb.gsfc.nasa.gov/WebServices/REST/py/sscws/index.html
- https://sscweb.gsfc.nasa.gov/WebServices/REST/SSC.xsd
- https://sscweb.gsfc.nasa.gov/WebServices/REST/jQueryExample3.html
- https://sscweb.gsfc.nasa.gov/
- https://sscweb.gsfc.nasa.gov/cgi-bin/Locator.cgi
- https://sscweb.gsfc.nasa.gov/scansat.shtml
- https://www.space.com/how-to-track-the-international-space-station
- https://qr.ae/prUETV

## State

### ISS position

The ISS position can be determined using NASA's [Satellite Situation Center](https://sscweb.gsfc.nasa.gov/WebServices/REST/) API.

```
POST https://sscweb.gsfc.nasa.gov/WS/sscr/2/locations
```

Data for the predicted position of the ISS is available only up to ~16 days in to the future. The previous ~7 days positions are also predicted but all previous days before are definitive. Postional data beyond 16 days into the future will need to be determined using historical data.

### User location

User location will be determined either automcatically using the device location data or entered manually by the user.

The location can be detmernined automatically using the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition).

```js
navigator.geolocation.getCurrentPosition(success, error, options)
```

The location can be entered manually using the [Geocoding API](https://openweathermap.org/api/geocoding-api) from OpenWeather. The user can enter a city name and the API will return its coordinates.

```
http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
```

## Determining sightings

A sighting will be registered as a pass of the ISS over the user's longitudinal location (within +-10 degrees), and within reasonable distance to their latitudinal location (+-30 degrees). The quality of the sighting will be determined based on the difference in average latitudinal distance between the ISS and the user, and the the duration of the sighting. Only sightings that occur during night time (6pm-6am) will be shown.

## Findings

The sightings shown to the user are based on predictions from the SSC. These predictions appear to be accurate to about +-10 minutes.


