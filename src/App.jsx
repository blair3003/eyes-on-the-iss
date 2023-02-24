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
        </div>
    )
}

function App() {

    const { location, sightings, getNewLocation, saveLocation, getCurrentLocation } = useApplicationState()

    return (
        <div className="App">
            <h1>Eyes on the ISS</h1>
            <p>Location: {location?.name}</p>
            <button onClick={saveLocation}>Save location</button>
            <button onClick={getCurrentLocation}>Current location</button>
            <form onSubmit={getNewLocation}>
                <label htmlFor="location">Enter a new location</label>
                <input id="location" type="text" placeholder="City, State, Country" />
                <button>Go</button>
            </form>
            {/* <p>Sightings: {JSON.stringify(sightings)}</p> */}


            <SightingsList sightings={sightings}/>

        </div>
    )
}

export default App
