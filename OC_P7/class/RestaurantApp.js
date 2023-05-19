import { Restaurant } from "./Restaurant.js";
import { RestaurantsPanel } from "./RestaurantsPanel.js";
import { CommentForm } from "./Form.js";
import { RestaurantForm } from "./Form.js";
import { Map } from "./Map.js";

export class RestaurantApp {
    constructor(userLat, userLong, srcType, zoom) {
        this.userLat = userLat;
        this.userLong = userLong;
        this.srcType = srcType;
        this.zoom = zoom;
        this.restaurants = [];
    }

    // crée la liste de restaurant en fonction de la source
    async getRestaurantsList() {
        let restaurantsData;
        if (this.srcType === 'localData') {
            restaurantsData = await this.getRestaurantsFromLocal();
        }
        else if (this.srcType === 'api') {
            restaurantsData = await this.getRestaurantsFromApi();
        }
    }

    //récupère les restaurants de l'api
    async getRestaurantsFromApi() {
        const self = this;
        let center = new google.maps.LatLng(this.userLat, this.userLong);
        const div = document.getElementById('google-result');
        
        let request = {
            location: center,
            radius: '500',
            type: ['restaurant']
        };

        let service = new google.maps.places.PlacesService(div);
        service.nearbySearch(request, (results, status) => {
            //initialise les restaurants
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                results.forEach(el => {
                    let restaurant = new Restaurant(el.name, el.vicinity, el.geometry.location.lat(), el.geometry.location.lng(), el.rating, el.place_id);
                    self.restaurants.push(restaurant);
                });
                self.initAllinstances();
            }
        });
    }

    // récupère les restaurant du fichier local
    async getRestaurantsFromLocal() {
        //initialise les restaurants
        let response = await fetch("./json/restaurant.json")
            .then(response => response.json())
            .catch(error => console.log(error));
        response.forEach(el => {
            let restaurant = new Restaurant(el.restaurantName, el.address, el.lat, el.long);
            restaurant.ratings = el.ratings;
            this.restaurants.push(restaurant);
        });

        this.initAllinstances()
    }

    //crée les instances
    initAllinstances() {
        let map = new Map(this.userLat, this.userLong, this.zoom, this.srcType);
        let commentForm = new CommentForm(map, "add-comment");
        let restaurantForm = new RestaurantForm(map, "add-restaurant");
        let restaurantPanel = new RestaurantsPanel(document.querySelector('#restaurants'), map, commentForm, restaurantForm, this);

        map.initMap();
        map.initMarkers(0, restaurantPanel, this.restaurants);
        restaurantPanel.applyFilter(this.restaurants);
        restaurantPanel.addCommentOnRestaurant(this.restaurants);
        restaurantPanel.addRestaurant(this.restaurants);

    }
}