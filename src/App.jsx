import { useApplicationState } from './store'

const LocationSearch = ({ getNewLocation }) => {
    return (
        <section className="p-4 text-white">
            <form className="flex bg-slate-900 w-100 p-2 rounded" onSubmit={getNewLocation}>
                <label className="offscreen" htmlFor="location">Enter a new location</label>
                <input className="px-2 bg-transparent grow" id="location" type="text" placeholder="Search location..." />
                <button className="px-2 font-bold">⌕</button>
            </form>
        </section>
    )
}

const LocationDetails = ({ location, getCurrentLocation, getHomeLocation, saveLocation }) => {
    return (
        <section className="p-4 flex">
            <h2 className="offscreen">Location Details</h2>
            <div className="grow px-4">
                <p className="text-2xl text-white">{location.name}</p>
                <p className="text-white">{location.lat}, {location?.lon}</p>
            </div>
            <div className="px-4 text-2xl flex justify-around items-center gap-6">
                <button onClick={getCurrentLocation}>🎯</button>
                <button onClick={getHomeLocation}>🏠</button>
                <button onClick={saveLocation}>💾</button>                
            </div>
        </section>
    )
}

const SightingsList = ({ sightings }) => {
    const listItems = sightings?.map((sighting, index) => <SightingsListItem sighting={sighting} key={index} />)
    return (
        <section className="p-4">
            {listItems}
        </section>
    )
}

const SightingsListItem = ({ sighting }) => {
    const start = new Date(sighting.start)
    return (
        <div className="flex justify-between text-white bg-slate-900 px-4 py-2 rounded mb-2">
            <div className="basis-full">
                {start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div className="basis-full">
                {start.toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="basis-full text-center">
                {sighting.direction}
            </div>
            <div className="basis-full text-right">
                {sighting.quality}
            </div>
        </div>
    )
}

function App() {

    const { location, sightings, getNewLocation, saveLocation, getCurrentLocation, getHomeLocation } = useApplicationState()

    return (
        <div className="min-h-screen bg-black">
            <h1 className="p-4 text-white text-4xl text-center font-mono" title="Eyes on the ISS">Eyes on the ISS</h1>
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
