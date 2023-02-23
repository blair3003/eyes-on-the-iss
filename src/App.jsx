import { useApplicationState } from './store'

const App = () => {

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
            <p>Sightings: {JSON.stringify(sightings)}</p>

        </div>
    )
}

export default App
