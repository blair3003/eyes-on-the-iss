import { useState, useEffect, useRef } from 'react'

export const useApplicationState = () => {

	const [positions, setPositions] = useState()
	const [location, setLocation] = useState()
	const [sightings, setSightings] = useState()

	const ready = useRef(true)

	const initPositions = async () => {
		const localPositions = localStorage.getItem('positions')
		if (localPositions && JSON.parse(localPositions).ttl > Date.now()) {
			console.log('Getting data from local storage')
			setPositions(JSON.parse(localPositions).positions)
		} else {
			try {
				console.log('Fetching data from NASA')
				const start = Date.now()
				const end = start + 30*24*60*60*1000 // 30 days (NASA returns at most ~12 days of data)
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
						lat: parseFloat(lats[i].textContent),
						lon: parseFloat(lons[i].textContent) > 180 ? parseFloat(lons[i].textContent) - 360 : parseFloat(lons[i].textContent),
						lt: parseFloat(lts[i].textContent)
					}
					positionArr.push(positionObj)
				}

				localStorage.setItem('positions', JSON.stringify({ ttl: start + 24*60*60*1000, positions: positionArr }))
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
						lon: 90
					})
					console.error(error)
				}
			)
		}
	}

	const updateSightings = () => {
		console.log('Updating sightings')
		console.log(location)

		const arr = positions.filter(position => 
			position.lat < location.lat + 45 &&
			position.lat > location.lat - 45 &&
			(position.lon + 360) % 360 < (location.lon + 360) % 360 + 10 &&
			(position.lon + 360) % 360 > (location.lon + 360) % 360 - 10
		)

		// const arr2 = arr.map(position => {
		// 	return {
		// 		...position,
		// 		pos: (position.lon + 180) % 360,
		// 		eq1: (location.lon + 180) % 360 + 45,
		// 		eq2: (location.lon + 180) % 360 - 45
		// 	}
		// })


		// (position.lon + 180) % 360 < (location.lon + 180) % 360 + 45

		// 0 - 360
		// -180 - 180

		console.log(arr)
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
			updateSightings()
		}
	}, [location, positions])

	return {
		location,
		sightings
	}
}