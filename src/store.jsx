import { useState, useEffect, useRef } from 'react'

export const useApplicationState = () => {

	const [positions, setPositions] = useState()
	const [location, setLocation] = useState()
	const [sightings, setSightings] = useState()

	const ready = useRef(true)

	const initPositions = async () => {
		const localPositions = localStorage.getItem('positions')
		if (localPositions) {
			console.log('Getting data from local storage')
			setPositions(JSON.parse(localPositions))
		} else {
			try {
				console.log('Fetching data from NASA')
				const start = Date.now()
				console.log(start)
				const end = start + 30*24*60*60*1000 // 30 days
				console.log(end)
				const stream = await fetch('https://sscweb.gsfc.nasa.gov/WS/sscr/2/locations', {
					method: "POST",
					headers: {
						'Content-Type': 'application/xml'
					},
					body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><DataRequest xmlns="http://sscweb.gsfc.nasa.gov/schema"><TimeInterval><Start>${new Date(start).toISOString()}</Start><End>${new Date(end).toISOString()}</End></TimeInterval><Satellites><Id>iss</Id><ResolutionFactor>1</ResolutionFactor></Satellites><OutputOptions><AllLocationFilters>true</AllLocationFilters><CoordinateOptions><CoordinateSystem>Geo</CoordinateSystem><Component>Lat</Component></CoordinateOptions><CoordinateOptions><CoordinateSystem>Geo</CoordinateSystem>
					<Component>Lon</Component></CoordinateOptions><CoordinateOptions><CoordinateSystem>Geo</CoordinateSystem><Component>Local_Time</Component></CoordinateOptions><MinMaxPoints>2</MinMaxPoints></OutputOptions></DataRequest>`
				})
				const xml = await stream.text()
				const parser = new DOMParser()
				const doc = parser.parseFromString(xml, "application/xml")
				const times = doc.querySelectorAll("Time")
				const lats = doc.querySelectorAll("Latitude")
				const lons = doc.querySelectorAll("Longitude")
				const lts = doc.querySelectorAll("LocalTime")

				if (times.length !== lats.length
				 || times.length !== lons.length
				 || times.length !== lts.length) {
					throw new Error('Data length mismatch')
				}

				const positionArr = []
				for (let i = 0; i < times.length; i++) {
					let positionObj = {
						time: times[i].textContent,
						lat: lats[i].textContent,
						lon: lons[i].textContent,
						lt: lts[i].textContent
					}
					positionArr.push(positionObj)
				}

				localStorage.setItem('positions', JSON.stringify(positionArr))
				setPositions(positionArr)
	
			} catch (err) {
				console.error(err)
			}
		}
	}

	const initLocation = () => {
		const localLocation = localStorage.getItem('location')
		if (localLocation) {
			console.log('Getting location from local storage')
			setLocation(JSON.parse(localLocation))
		} else {
			console.log("Getting location from user's device")
			navigator.geolocation.getCurrentPosition(
				success => {
					const locObj = {
						name: "Home",
						lat: success.coords.latitude,
						lon: success.coords.longitude
					}
					setLocation(locObj)
					localStorage.setItem('location', JSON.stringify(locObj))
				},
				error => {
					setLocation({
						name: "Null Island",
						lat: 0,
						lon: 0
					})
					console.error(error)
				}
			)
		}
	}

	useEffect(() => {
		if (ready.current) {
			console.log('Ready')
			initPositions()
			initLocation()
			return () => ready.current = false
		}
	}, [])

	useEffect(() => {
		if (location && positions) {
			console.log(`Location updated and data exists`)
			console.log(positions)
		}


		// TODO: Determine sightings based on data
		// setSightings(JSON.parse(localPositions))


	}, [location, positions])

	return {
		location,
		sightings
	}
}