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
				const end = start + 30*24*60*60*1000 // 30 days (NASA returns at most ~16 days of data)
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

	const initLocation = async () => {
		const localLocation = localStorage.getItem('location')
		if (localLocation) {
			console.log('Getting location from local storage')
			setLocation(JSON.parse(localLocation))
		} else {
			console.log("Getting location from user's device")
			getCurrentLocation(true)
		}
	}

	const getSightingDetails = positions => {
		const start = new Date(positions[0].time)
		const duration = positions.length
		const quality = Math.floor((positions.length / Math.abs(location.lat - (positions.reduce((accumulator, currentPosition) => accumulator + currentPosition.lat, 0) / positions.length )) * 100))
		// const direction = `${(location.lat - positions[0].lat < 0 ? 'N' : 'S')}${(location.lon - positions[0].lon < 0 ? 'E' : 'W')}/${(location.lat - positions[positions.length-1].lat < 0 ? 'N' : 'S')}${(location.lon - positions[positions.length-1].lon < 0 ? 'E' : 'W')}`
		const direction = 'tbd'
		return { start, duration, quality, direction }
	}

	const updateSightings = () => {
		console.log('Updating sightings')
		console.log(location)		
		let visiblePositions = positions.filter(position => 
			position.lat < location.lat + 30 &&
			position.lat > location.lat - 30
		)			
		const upperLon = (location.lon + 10 > 180) ? (location.lon + 10 - 360) : location.lon + 10
		const lowerLon = (location.lon - 10 < -180) ? (location.lon - 10 + 360) : location.lon - 10
		if (lowerLon < upperLon) {
			visiblePositions = visiblePositions.filter(position =>
				lowerLon < position.lon && position.lon < upperLon
			)
		} else {
			visiblePositions = visiblePositions.filter(position =>
				lowerLon < position.lon || position.lon < upperLon
			)
		}
		visiblePositions.sort((a,b) => Date.parse(a.time) - Date.parse(b.time))
		const groupedPositions = []
		visiblePositions.reduce((accumulator, currentPosition) => {
			if(!accumulator.length || Date.parse(currentPosition.time) - Date.parse(accumulator[accumulator.length - 1].time) < (2*60*1000)) {
				accumulator.push(currentPosition)
				return accumulator
			}
			groupedPositions.push(accumulator)
			return []
		}, [])
		const suitableSightings = []
		groupedPositions.forEach(positions => {
			if (positions.length > 2 && (positions[0].lt >= 18 || positions[0].lt < 6)) {
				const { start, duration, quality, direction } = getSightingDetails(positions)
				suitableSightings.push({
					start,
					duration,
					quality,
					direction,
					positions
				})
			}
		})
		console.log(suitableSightings)
		setSightings(suitableSightings)
	}

	const getNewLocation = async event => {
		event.preventDefault()
		const text = event.target.elements.location.value
		const clean = text.trim().replaceAll(/ {1,}/g, ",")
		if (!clean.length) return
		const url = encodeURI(`https://api.openweathermap.org/geo/1.0/direct?q=${clean}&limit=1&appid=bbb2f467000e0e77f835621659f14509`)		
		try {
			console.log('Fetching location')
			const stream = await fetch(url)
			const json = await stream.json()
			if (json[0]) {
				console.log(json[0])
				setLocation({
					name: json[0].name,
					lat: json[0].lat,
					lon: json[0].lon
				})
			} else {
				throw new Error('No location found')
			}
		} catch (err) {
			console.error(err)
		}
	}

	const saveLocation = () => {
		if (location) {
			console.log(`Saving location`)
			localStorage.setItem('location', JSON.stringify(location))
		}
	}

	const getCurrentLocation = () => {
		navigator.geolocation.getCurrentPosition(
			success => {
				const locObj = {
					name: "Home",
					lat: success.coords.latitude,
					lon: success.coords.longitude
				}
				setLocation(locObj)
			},
			error => {
				setLocation({
					name: "Null Island",
					lat: 0,
					lon: 180
				})
				console.error(error)
			}
		)
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
		sightings,
		getNewLocation,
		saveLocation,
		getCurrentLocation
	}
}