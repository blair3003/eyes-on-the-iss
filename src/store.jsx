import { useState, useEffect } from 'react'

export const useApplicationState = () => {

	const [location, setLocation] = useState(null)

	useEffect(() => {
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
					console.log('Location set and local storage updated')
				},
				error => {
					console.error(error)
				}
			)
		}
	}, [])

	return {
		location
	}
}