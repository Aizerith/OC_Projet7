import { Restaurant } from "./Restaurant.js";

export class RestaurantApp {
    constructor(userLat, userLong, srcType) {
        this.userLat = userLat;
        this.userLong = userLong;
        this.srcType = srcType;
    }

    async getRestaurantsList() {

        let restaurantsData;
        if (this.srcType === 'localData') {
            restaurantsData = await this.getRestaurantsFromLocal();
            return restaurantsData;
        }
        else if (this.srcType === 'api'){
            restaurantsData = await this.getRestaurantsFromApi();
            return restaurantsData;
        }
    }

    async getRestaurantsFromLocal() {
        let restaurantsData = [];
        let response = await fetch("./json/restaurant.json")
            .then(response => response.json())
            .catch(error => console.log(error));
        response.forEach(el => {
            let restaurant = new Restaurant(el.restaurantName, el.address, el.lat, el.long);
            restaurant.ratings = el.ratings;
            restaurantsData.push(restaurant);
        });
        return restaurantsData;
    }

    async getRestaurantsFromApi() {
        //const proxy = 'https://cors-anywhere.herokuapp.com/';
        const fetchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.userLat}%2C${this.userLong}&radius=100&type=restaurant&key=AIzaSyAej4cmqUEsPkrqAR7tZBQAxxTZFfuxwE8`;
        let service;
        let restaurantsData = [];
        let center = new google.maps.LatLng(this.userLat, this.userLong);

        const div = document.getElementById('google-result');

        let request = {
            location: center,
            radius: '100',
            type: ['restaurant']
        };

        service = new google.maps.places.PlacesService(div);
        service.nearbySearch(request, (results, status) => {
            console.log("get resto from api", results);
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                results.forEach(el => {
                    let restaurant = new Restaurant(el.name, el.vicinity, el.geometry.location.lat(), el.geometry.location.lng(), el.rating, el.place_id);
                    console.log(restaurant);
                    restaurantsData.push(restaurant);
                });
            }
        });
        console.log("resto data", restaurantsData);
        /*
        let response = await fetch(fetchUrl)
            .then(response => response.json())
            .catch(error => console.log(error));
        response.results.forEach(el => {
            let restaurant = new Restaurant(el.name, el.vicinity, el.geometry.location.lat, el.geometry.location.lng, el.rating, el.place_id);
            restaurantsData.push(restaurant);
        });*/
        return restaurantsData;
    }
}