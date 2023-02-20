import { useState, useEffect } from 'react'

export const useApplicationState = () => {

	const [location, setLocation] = useState({
		lat: 0,
		lon: 0
	})
	const [sightings, setSightings] = useState([])

	useEffect(() => {
		const localLocation = localStorage.getItem('location')
		if (localLocation) {
			console.log('Getting location from local storage')
			setLocation(JSON.parse(localLocation))
			console.log('Location set')
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
					console.log('Location set and local storage updated')
				},
				error => {
					console.error(error)
				}
			)
		}
	}, [])

	useEffect(() => {
		console.log('Location changed - getting ISS sightings')
		let data = localStorage.getItem('data')
		if (!data) {
			console.log("Getting positional data from NASA")
			// TODO: Fetch data with either Axios or React Query
			// https://www.youtube.com/watch?v=lLWfZL-Y8lM
			data = JSON.stringify(['here be data'])

			localStorage.setItem('data', data)
		}

		// TODO: Determine sightings based on data

		

		setSightings(JSON.parse(data))


	}, [location])

	return {
		location,
		sightings
	}
}