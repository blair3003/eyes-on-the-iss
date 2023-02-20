import { useApplicationState } from './store'

const App = () => {

    const { location } = useApplicationState()

    return (
        <div className="App">
            <h1>Eyes on the ISS</h1>
            <p>Location: {JSON.stringify(location.lat)}, {JSON.stringify(location.lon)}</p>

        </div>
    )
}

export default App
