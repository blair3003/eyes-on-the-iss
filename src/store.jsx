import { useState, useEffect } from 'react'
import { fetchPositionalData } from './apiNasa'

export const useApplicationState = () => {

	const [location, setLocation] = useState({
		lat: 0,
		lon: 0
	})
	const [sightings, setSightings] = useState([])

	const getPositionalData = () => {
		let localData = localStorage.getItem('data')
		if (!localData) {


			try {
					// const stream = await fetch('https://sscweb.gsfc.nasa.gov/WS/sscr/2/locations', {
					// 	method: "POST",
					// })
					// const data = await stream.json()
					// return data
					return ['here be data']
				} catch (err) {
					console.error(err)
				}








			console.log("Getting positional data from NASA")
			const data = fetchPositionalData()
			console.log(data)
			localData = JSON.stringify(data)
			localStorage.setItem('data', localData)
		}

	}

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


		// TODO: Determine sightings based on data
		setSightings(JSON.parse(localData))


	}, [location])

	return {
		location,
		sightings
	}
}