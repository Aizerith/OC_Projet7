import { Map } from "../class/Map.js";
import { RestaurantsPanel } from "../class/RestaurantsPanel.js";
import { CommentForm } from "../class/Form.js";
import { RestaurantForm } from "../class/Form.js";
import { RestaurantApp } from "../class/RestaurantApp.js";

// parametre initial
let dataFromLocal = 'localData';
let dataFromApi = 'api'
let userLat = 48.8737815;
let userLong = 2.3501649;
let zoom = 20;

let app = new RestaurantApp(userLat, userLong, dataFromApi)

const restaurants = await app.getRestaurantsList();
console.log("liste restaurants", restaurants)
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
	console.log("geolocalisation non activé");
	initApp(userLat, userLong, zoom, restaurants, app.srcType);
/*}*/

function initApp(userLat, userLong, zoom, restaurants, srcType){
	let map = new Map(userLat, userLong, zoom, srcType);
	let commentForm = new CommentForm(map, "add-comment");
	let restaurantForm = new RestaurantForm(map, "add-restaurant");
	let restaurantPanel = new RestaurantsPanel(document.querySelector('#restaurants'), map, commentForm, restaurantForm, app);
 
	console.log(map)
	map.initMap();
	map.initMarkers(0, restaurantPanel, restaurants);
	restaurantPanel.applyFilter(restaurants);
	restaurantPanel.addCommentOnRestaurant(restaurants);
	restaurantPanel.addRestaurant(restaurants);
};