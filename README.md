# Eyes on the ISS

Find out the best time to see the ISS in the sky above you!

## How it works

The app fetches the ISS location data from a NASA API and caches it in local storage. If the data in local storage is not stale, it will be loaded from there instead.

The user will then provide a location, or their device will provide one automatically, and the app will provide a list of upcoming passes of the ISS over this location.

The upcoming passes of the ISS will be displayed as timeslots with information including the time of day, the direction to look in, and the predicted quality of the sighting.

The user can then use these listings to determine a suitable time to try and catch a glimpse of the ISS in the sky above them.

## Requirements

NASA API - [Satellite Situation Center](https://sscweb.gsfc.nasa.gov/WebServices/REST/)

Endpoint - https://sscweb.gsfc.nasa.gov/WS/sscr/2/locations

API Key - BpWznLX4H1bH2IQEFWVeTdqpm9UD6xM6MWoIeDTl (optional?)

## More info

- https://sscweb.gsfc.nasa.gov/WebServices/REST/py/sscws/index.html
- https://sscweb.gsfc.nasa.gov/WebServices/REST/SSC.xsd
- https://sscweb.gsfc.nasa.gov/WebServices/REST/jQueryExample3.html
