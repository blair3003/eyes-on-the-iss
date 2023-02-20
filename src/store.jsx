import { useState, useEffect, useRef } from 'react'

export const useApplicationState = () => {

	const [data, setData] = useState('')
	const [location, setLocation] = useState(null)
	const [sightings, setSightings] = useState([])

	const ready = useRef(true)

	const getData = async () => {
		const localData = localStorage.getItem('data')
		if (localData) {
			console.log('Getting data from local storage')
			setData(localData)
		} else {
			try {
				console.log('Fetching data from NASA')
				const stream = await fetch('https://sscweb.gsfc.nasa.gov/WS/sscr/2/locations', {
					method: "POST",
					headers: {
						'Content-Type': 'application/xml'
					},
					body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><DataRequest xmlns="http://sscweb.gsfc.nasa.gov/schema"><TimeInterval><Start>2023-02-18T00:00:00.000Z</Start><End>2024-02-17T23:59:59.000Z</End></TimeInterval><Satellites><Id>iss</Id><ResolutionFactor>15</ResolutionFactor></Satellites><OutputOptions><AllLocationFilters>true</AllLocationFilters><CoordinateOptions><CoordinateSystem>Geo</CoordinateSystem><Component>Lat</Component></CoordinateOptions><CoordinateOptions><CoordinateSystem>Geo</CoordinateSystem>
					<Component>Lon</Component></CoordinateOptions><CoordinateOptions><CoordinateSystem>Geo</CoordinateSystem><Component>Local_Time</Component></CoordinateOptions><MinMaxPoints>2</MinMaxPoints></OutputOptions></DataRequest>`
				})
				const xml = await stream.text()
				const parser = new DOMParser()
				const doc = parser.parseFromString(xml, "application/xml")
				const data = doc.querySelector("Data")
				const serializer = new XMLSerializer()
				const xmlStr = serializer.serializeToString(data)
				localStorage.setItem('data', xmlStr)
				setData(xmlStr)	
				/*	
					Make an array of objects
	
					[
						{
							time: "2023-02-18T00:00:00.000Z"
							lt: 17.25777777777778
							lon: 258.8679
							lat: -30.410204
						}
					]	
				*/
	
			} catch (err) {
				console.error(err)
			}
		}
	}

	const getLocation = () => {
		const localLocation = localStorage.getItem('location')
		if (localLocation) {
			console.log('Getting location from local storage')
			setLocation(JSON.parse(localLocation))
		} else {
			console.log("Getting location from user's device")
			navigator.geolocation.getCurrentPosition(
				success => {
					const locObj = {
						lat: success.coords.latitude,
						lon: success.coords.longitude
					}
					setLocation(locObj)
					localStorage.setItem('location', JSON.stringify(locObj))
				},
				error => {
					setLocation({
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
			getData()
			getLocation()
			return () => ready.current = false
		}
	}, [])

	useEffect(() => {
		if (location && data) {
			console.log(`Location updated and data exists`)
			console.log(data)
		}


		// TODO: Determine sightings based on data
		// setSightings(JSON.parse(localData))


	}, [location, data])

	return {
		location,
		sightings
	}
}