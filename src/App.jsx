import { useApplicationState } from './store'

const App = () => {

    const { location, sightings } = useApplicationState()

    return (
        <div className="App">
            <h1>Eyes on the ISS</h1>
            <p>Location: {JSON.stringify(location?.lat)}, {JSON.stringify(location?.lon)}</p>
            <p>Sightings: {JSON.stringify(sightings)}</p>

        </div>
    )
}

export default App
