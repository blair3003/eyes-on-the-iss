import { useApplicationState } from './store'
import { BiTargetLock } from 'react-icons/bi'
import { AiFillHome, AiFillSave } from 'react-icons/ai'
import { MdSignalCellular1Bar, MdSignalCellular2Bar, MdSignalCellular3Bar, MdSignalCellular4Bar } from 'react-icons/md'

const LocationSearch = ({ loading, getNewLocation }) => {
    return (
        <section className="p-4 text-white">
            <form className="flex bg-slate-900 w-100 p-2 rounded" onSubmit={getNewLocation}>
                <label className="offscreen" htmlFor="location">Enter a new location</label>
                <input className="px-2 bg-transparent grow" id="location" type="text" placeholder="Search location..." />
                <button className="px-2 text-2xl font-bold" disabled={loading}>⌕</button>
            </form>
        </section>
    )
}

const LocationDetails = ({ location, loading, getCurrentLocation, getHomeLocation, saveLocation }) => {
    return (
        <section className="p-4 flex">
            <h2 className="offscreen">Location Details</h2>
            <div className="grow px-4">
                <p className="text-2xl text-white">{location?.name}</p>
                <p className="text-white">{location?.lat}, {location?.lon}</p>
            </div>
            <div className="px-4 text-2xl flex justify-around items-center gap-6">
                <button onClick={getCurrentLocation} disabled={loading}><BiTargetLock className="text-white" /></button>
                <button onClick={getHomeLocation} disabled={loading}><AiFillHome className="text-white" /></button>
                <button onClick={saveLocation} disabled={loading}><AiFillSave className="text-white" /></button>                
            </div>
        </section>
    )
}

const SightingsList = ({ sightings, loading, error }) => {
    const listItems = sightings?.map((sighting, index) => <SightingsListItem sighting={sighting} key={index} />)
    return (
        <section className="p-4">
            {
                (error) ? <p className="text-red-600 p-4">There has been an error, please reload the page.</p>
              : (listItems?.length) ? listItems
              : <p className="text-white p-4">No sightings to list.</p>
            }
        </section>
    )
}

const SightingsListItem = ({ sighting }) => {
    const start = new Date(sighting.start)
    return (
        <div className="flex justify-between text-white bg-slate-900 px-4 py-2 rounded mb-2 bg-opacity-80">
            <div className="basis-full">
                {start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div className="basis-full">
                {start.toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="basis-full text-center">
                {sighting.direction}
            </div>
            <div className="flex justify-end items-center">
                {
                    (sighting.quality > 1000) ? <MdSignalCellular4Bar className="text-blue-600 text-lg" /> :
                    (sighting.quality > 100) ? <MdSignalCellular3Bar className="text-green-600 text-lg" /> :
                    (sighting.quality > 20) ? <MdSignalCellular2Bar className="text-yellow-600 text-lg" /> :
                    <MdSignalCellular1Bar className="text-red-600 text-lg" />
                }
            </div>
        </div>
    )
}

function App() {

    const {
        location,
        sightings,
        loading,
        error,
        getNewLocation,
        saveLocation,
        getCurrentLocation,
        getHomeLocation
    } = useApplicationState()

    return (
        <div className="h-screen bg-iss bg-cover overflow-y-scroll">
            <h1 className="p-4 text-white text-3xl text-center font-mono" title="Eyes on the ISS">Eyes on the ISS 🛰</h1>
            <LocationSearch
                loading={loading}
                getNewLocation={getNewLocation}
            />
            <LocationDetails
                location={location}
                loading={loading}
                getCurrentLocation={getCurrentLocation}
                getHomeLocation={getHomeLocation}
                saveLocation={saveLocation}
            />
            <SightingsList
                sightings={sightings}
                loading={loading}
                error={error}
            />
        </div>
    )
}

export default App
