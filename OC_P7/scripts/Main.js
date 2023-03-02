import { Map } from "../class/Map.js";
import { Marker } from "../class/Marker.js";
import { Restaurants } from "../class/Restaurants.js";

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(position => {
		let userLat = position.coords.latitude;
		let userLong = position.coords.longitude;
		console.log(userLat, userLong);
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
	//let marker = new Marker(map, userLat, userLong);
	let displayRest = new Restaurants(document.querySelector('#restaurants'), map);
	map.initMap();
	map.initMarkers(0, displayRest);
	applyFilter(map, displayRest);
};

function applyFilter(map, displayRest) {

	let minInput = document.getElementById("min-rate");
	let maxInput = document.getElementById("max-rate");
	let btn = document.getElementById("filterBtn");
	btn.disabled = true;

	minInput.addEventListener('input', e => {
		e.preventDefault();
		console.log(minInput.value, maxInput.value)
		if (minInput.value <= maxInput.value) {
			btn.disabled = false;
		}
		else {
			btn.disabled = true;
		}
	});

	maxInput.addEventListener('input', e => {
		e.preventDefault();
		console.log(minInput.value, maxInput.value)
		if (minInput.value <= maxInput.value) {
			btn.disabled = false;
		}
		else {
			btn.disabled = true;
		}
	});

	btn.addEventListener('click', e => {
		e.preventDefault();
		// récupérer les valeurs de min et de max
		let filter = {
			min: minInput.value,
			max: maxInput.value
		};

		console.log(filter.min, filter.max);
		map.clearMarkers();
		map.initMarkers(filter, displayRest);
	})
}
