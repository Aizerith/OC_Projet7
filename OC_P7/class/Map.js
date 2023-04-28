export class Map {
    constructor(userLat, userLong, zoom, srcType) {
        this.srcType = srcType
        this.userLat = userLat;
        this.userLong = userLong;
        this.zoom = zoom;
        this.restMap = L.map('map').setView([userLat, userLong], zoom);
        this.markerClusters = L.markerClusterGroup();
    }

    // affiche la map et la position de l'utilisateur
    initMap() {
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
        return (this.restMap);
    }

    // creer marqueur restaurant + bind image street view sur marqueur
    createMarker(restaurant, restaurantPanel) {
        console.log("create marker", restaurant)
        let marker = L.marker([restaurant.lat, restaurant.long]).addTo(this.restMap).on('click', e =>{
            document.getElementById("panorama").classList.add('active');
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
            console.log(e.latlng);
        });
        this.bindCommentOnMarker(marker, restaurantPanel, restaurant)
        this.markerClusters.addLayer(marker);

    }

    bindCommentOnMarker(marker, restaurantPanel, restaurant) {
        if (this.srcType === 'localData') {
            marker.bindPopup(restaurantPanel.showComment(restaurant));
        } else if (this.srcType === 'api') {
            //Do something custom after marker is clicked
            marker.addEventListener('click', e => {
                restaurantPanel.addCommentFromApi(restaurant);
                marker.bindPopup(restaurantPanel.showComment(restaurant))
            })
        }
    }

    // affiche marqueur restaurant
    showRestaurantMarker(jsonObj, restaurantPanel) {
        jsonObj.forEach(element => {
            console.log("show restaurant marker", element);
            this.createMarker(element, restaurantPanel);
        });
        this.restMap.addLayer(this.markerClusters);
    }

    // initialise les marqueurs
    initMarkers(filter = false, restaurantPanel, restaurants) {
        console.log("list restaurant:", restaurants);
        let list;
        if (filter) {
            let newRestaurants = restaurants.filter(element => restaurantPanel.getAverageRating(element) >= Number(filter.min).toFixed(1)
                && restaurantPanel.getAverageRating(element) <= Number(filter.max).toFixed(1));
            list = newRestaurants;
        }
        else {
            list = restaurants;
        }
        console.log("liste filtré", list);
        this.showRestaurantMarker(list, restaurantPanel);
        restaurantPanel.clearRestaurant();
        restaurantPanel.displayRestaurants(list);
    }

    // efface les marqueurs
    clearMarkers() {
        this.restMap.removeLayer(this.markerClusters);
        this.markerClusters = L.markerClusterGroup();
    }

    resetMarkers(restaurantList, restaurantPanel){
        this.clearMarkers();
        this.showRestaurantMarker(restaurantList, restaurantPanel)
    }
}