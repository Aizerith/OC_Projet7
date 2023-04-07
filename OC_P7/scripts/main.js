import { Map } from "../class/Map.js";
import { RestaurantsPanel } from "../class/RestaurantsPanel.js";
import { CommentForm } from "../class/Form.js";
import { RestaurantForm } from "../class/Form.js";

//fork and spoon api options
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '1bdf22a00dmsh034741bde98ca53p1687d9jsn2fce29e10666',
		'X-RapidAPI-Host': 'the-fork-the-spoon.p.rapidapi.com'
	}
};
/*
fetch('https://the-fork-the-spoon.p.rapidapi.com/restaurants/v2/list?queryPlaceValueCityId=415144&pageSize=10&pageNumber=1&queryPlaceValueCoordinatesLatitude=48.864389&queryPlaceValueCoordinatesLongitude=2.360854', options)
	.then(response => response.json())
    .then(response => console.log(response))
	.catch(err => console.error(err));

fetch('https://the-fork-the-spoon.p.rapidapi.com/restaurants/v2/get-info?restaurantId=650337', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
*/

async function getData() {
    let response = await fetch("./json/restaurant.json");
    let restaurantsData = await response.json();
    return restaurantsData;
}

const restaurants = await getData();

// parametre initial
let userLat = 48.8737815;
let userLong = 2.3501649;
let zoom = 15;
/*
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(position => {
		userLat = position.coords.latitude;
		userLong = position.coords.longitude;
		console.log(userLat, userLong);
		initApp(userLat, userLong, zoom, restaurants);
	})
}
else {*/
	console.log("message");
	initApp(userLat, userLong, zoom, restaurants);
/*}*/

function initApp(userLat, userLong, zoom, restaurants){
	let map = new Map(userLat, userLong, zoom);
	//let restForm = new Form(map);
	let commentForm = new CommentForm(map, "add-comment");
	let restaurantForm = new RestaurantForm(map, "add-restaurant");
	let displayRest = new RestaurantsPanel(document.querySelector('#restaurants'), map, commentForm, restaurantForm);
 
	console.log(map)
	map.initMap();
	map.initMarkers(0, displayRest, restaurants);
	displayRest.applyFilter(restaurants);
	displayRest.addCommentOnRestaurant(restaurants);
	displayRest.addRestaurant(restaurants);
};