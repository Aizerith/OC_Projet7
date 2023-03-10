import { Map } from "../class/Map.js";
import { Marker } from "../class/Marker.js";
import { Restaurants } from "../class/Restaurants.js";

/*if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(position => {
		let userLat = position.coords.latitude;
		let userLong = position.coords.longitude;
		console.log(userLat, userLong);
		initApp(userLat, userLong, 15);
	});

} else {*/
	initApp();
/*}*/
/*
const babalouPos = { lat: 48.8865035, lng: 2.3442197 }
const panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano-test"),
    {
      position: babalouPos,
      pov: {
        heading: 34,
        pitch: 10,
      },
    }
  );
*/

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

function initApp(userLat = 48.8737815, userLong = 2.3501649, zoom = 15){
	let map = new Map(userLat, userLong, zoom);
	//let marker = new Marker(map, userLat, userLong);
	let displayRest = new Restaurants(document.querySelector('#restaurants'), map);
	map.initMap();
	map.initMarkers(0, displayRest);
	applyFilter(map, displayRest);
	addComment();
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
		let filter = {
			min: minInput.value,
			max: maxInput.value
		};
		map.clearMarkers();
		map.initMarkers(filter, displayRest);
	})
}

function addComment(){
	let clickEvent = document.getElementById("restaurants");
	clickEvent.addEventListener('click', e => {
		e.preventDefault();
		let comment = addCommentForm();
		document.getElementById("add-comment").classList.toggle('active');
		let restoName = e.target.getAttribute("data-restaurant");
		fetch("./json/restaurant.json")
		.then(response => response.json())
		.then(response => { 
			response.forEach(element => {
				if(element.restaurantName == restoName){
					element.ratings.push(comment);
				}
				console.log(element.ratings)
			})
			console.log(response);
		})
		});
}

function addCommentForm(){
	let parentElt = document.getElementById("add-comment");
	parentElt.innerHTML = `
		<div class="modal">
			<h2>Ajouter un avis</h2>
			<form methode="get" class="add-comment-form">
				<div class="comment-form">
					<label for="stars">Note: </label>
					<input type="number" id="stars "name="stars" min="1" max ="5" required>
			  	</div>
				  <div class="comment-form">
				  <label for="comment">commentaire: </label>
				  <input type="text" id="comment" name="comment">
				</div>
				<input type="submit" value="Ajouter" id="confirm-comment">
			</form>
		</div>
	`
	const form = document.querySelector("form.add-comment-form");
	form.addEventListener('submit', e => {
		e.preventDefault();
		const formData = new FormData(form);
		const comment = Object.fromEntries(formData.entries());
		document.getElementById("add-comment").classList.toggle('active');
		console.log(comment);
	});
	return comment;
}
