import { useApplicationState } from './store'

const SightingsList = ({ sightings }) => {
    const listItems = sightings?.map((sighting, index) => <SightingsListItem sighting={sighting} key={index} />)
    return (
        <div>
            {listItems}
        </div>
    )
}

const SightingsListItem = ({ sighting }) => {
    const start = new Date(sighting.start)
    return (
        <div>
            <div>
                {start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div>
                {start.toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div>
                {sighting.direction}
            </div>
            <div>
                {sighting.quality}
            </div>
        </div>
    )
}

const LocationSearch = ({ getNewLocation }) => {
    return (
        <form onSubmit={getNewLocation}>
            <label htmlFor="location">Enter a new location</label>
            <input id="location" type="text" placeholder="City, State, Country" />
            <button>⌕</button>
        </form>
    )
}

const LocationDetails = ({ location, getCurrentLocation, getHomeLocation, saveLocation }) => {
    return (
        <div>
            <p>{location?.name}</p>
            <p>{location?.lat}, {location?.lon}</p>
            <button onClick={getCurrentLocation}>🎯</button>
            <button onClick={getHomeLocation}>🏠</button>
            <button onClick={saveLocation}>💾</button>
        </div>
    )
}

function App() {

    const { location, sightings, getNewLocation, saveLocation, getCurrentLocation, getHomeLocation } = useApplicationState()

    return (
        <div className="App">
            <h1>Eyes on the ISS</h1>
            <LocationSearch getNewLocation={getNewLocation} />
            <LocationDetails
                location={location}
                getCurrentLocation={getCurrentLocation}
                getHomeLocation={getHomeLocation}
                saveLocation={saveLocation}
            />
            <SightingsList sightings={sightings}/>
        </div>
    )
}

export default App
