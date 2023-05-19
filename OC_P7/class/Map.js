export class Map {
    constructor(userLat, userLong, zoom, srcType) {
        this.srcType = srcType
        this.userLat = userLat;
        this.userLong = userLong;
        this.zoom = zoom;
        this.restMap = L.map('map').setView([userLat, userLong], zoom);
        this.markerClusters = L.markerClusterGroup();
        this.restaurants = [];
    }

    // affiche la map et la position de l'utilisateur
    async initMap() {
        L.tileLayer('https://maps.geoapify.com/v1/tile/osm-bright-grey/{z}/{x}/{y}.png?apiKey=2ef7298e24614620b7782d66e5959b74', {
            attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
            maxZoom: 19,
            id: 'osm-bright'
        }).addTo(this.restMap);

        let userPosIcon = L.icon({
            iconUrl: '../images/userPos.png',
            iconSize: [35, 40],
            iconAnchor: [13, 27],
            popupAnchor: [6, -18]
        });
        let marker = L.marker([this.userLat, this.userLong], { icon: userPosIcon }).addTo(this.restMap);
        marker.bindPopup('Votre Position');

    }

    // creer marqueur restaurant + bind image street view sur marqueur
    createMarker(restaurant, restaurantPanel) {
        let marker = L.marker([restaurant.lat, restaurant.long]).addTo(this.restMap).on('click', e => {
            document.getElementById("panorama").classList.add('active');
            document.getElementById("restaurants").classList.add('active');
            const panoPos = { lat: e.latlng.lat, lng: e.latlng.lng }
            const panorama = new google.maps.StreetViewPanorama(
                document.getElementById("panorama"),
                {
                    position: panoPos,
                    pov: {
                        heading: 34,
                        pitch: 10,
                    },
                }
            );
        });
        this.bindCommentOnMarker(marker, restaurantPanel, restaurant)
        this.markerClusters.addLayer(marker);

    }

    // ajoute les commentaires sur le popup des markers
    async bindCommentOnMarker(marker, restaurantPanel, restaurant) {
        if (this.srcType === 'localData') {
            marker.bindPopup(restaurantPanel.showComment(restaurant));
        } else if (this.srcType === 'api') {
            marker.bindPopup("");
            marker.on("click", e => {
                const popup = marker.getPopup();
                if (restaurant.place_id != 0) {
                    restaurantPanel.addCommentFromApi(restaurant, popup);
                } 
            })
        }
    }

    // affiche marqueur restaurant
    async showRestaurantMarker(list, restaurantPanel) {
        list.forEach(element => {
            this.createMarker(element, restaurantPanel);
        });
        this.restMap.addLayer(this.markerClusters);
    }

    // initialise les marqueurs
    initMarkers(filter = false, restaurantPanel, restaurants) {
        let list;
        if (filter) {
            let newRestaurants = restaurants.filter(element => restaurantPanel.getAverageRating(element) >= Number(filter.min).toFixed(1)
                && restaurantPanel.getAverageRating(element) <= Number(filter.max).toFixed(1));
            list = newRestaurants;
        }
        else {
            list = restaurants;
        }
        this.showRestaurantMarker(list, restaurantPanel);
        restaurantPanel.clearRestaurant();
        restaurantPanel.displayRestaurants(list);
    }

    // efface les marqueurs
    clearMarkers() {
        this.restMap.removeLayer(this.markerClusters);
        this.markerClusters = L.markerClusterGroup();
    }

    resetMarkers(restaurantList, restaurantPanel) {
        this.clearMarkers();
        this.initMarkers(restaurantPanel.filter, restaurantPanel, restaurantList)
    }
}