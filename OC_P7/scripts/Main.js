import { Map } from "../class/Map.js";
import { Marker } from "../class/Marker.js";
import { Restaurants } from "../class/Restaurants.js";

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(position => {
		let userLat = position.coords.latitude;
		let userLong = position.coords.longitude;
		initApp(userLat, userLong, 11);
	});

} else {
	initApp();
}

/* ====== pour api the-fork-the-spoon
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '1bdf22a00dmsh034741bde98ca53p1687d9jsn2fce29e10666',
		'X-RapidAPI-Host': 'the-fork-the-spoon.p.rapidapi.com'
	}
};

fetch('https://the-fork-the-spoon.p.rapidapi.com/restaurants/v2/list?queryPlaceValueCityId=415144&pageSize=10&pageNumber=1&queryPlaceValueCoordinatesLatitude=48.864389&queryPlaceValueCoordinatesLongitude=2.360854', options)
	.then(response => response.json())
    .then(response => showRestaurantMarker(response))
	.catch(err => console.error(err));
======*/

function initApp(userLat = 48.8737815, userLong = 2.3501649, zoom = 11){
	let map = new Map(userLat, userLong, zoom);
	let marker = new Marker(map.initMap(), userLat, userLong);
	marker.showUserMarker();
	let displayRest = new Restaurants(document.querySelector('#restaurants'));

	fetch("./json/restaurant.json")
    .then(response => response.json())
    .then(response => marker.showRestaurantMarker(response))
    .then(response => displayRest.displayRestaurants(response))
	.catch(err => console.error(err));

	
};

