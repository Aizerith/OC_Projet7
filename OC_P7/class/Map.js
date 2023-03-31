export class Map {
    constructor(userLat, userLong, zoom) {
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
            maxZoom: 20,
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
    createMarker(element, displayRest) {
        let marker = L.marker([element.lat, element.long]).addTo(this.restMap).on('click', function (e) {
            document.getElementById("pano-test").classList.add('active');
            /*const panoPos = { lat: e.latlng.lat, lng: e.latlng.lng }
            const panorama = new google.maps.StreetViewPanorama(
                document.getElementById("pano-test"),
                {
                    position: panoPos,
                    pov: {
                        heading: 34,
                        pitch: 10,
                    },
                }
            );
            console.log(e.latlng);*/
        });
        //let marker = L.marker([element.geo.latitude, element.geo.longitude]).addTo(map); // pour api
        marker.bindPopup(displayRest.showComment(element));
        this.markerClusters.addLayer(marker);
    }

    // affiche marqueur restaurant
    showRestaurantMarker(jsonObj, displayRest) {
        //jsonObj.data.forEach(element => { // pour api
        jsonObj.forEach(element => {
            this.createMarker(element, displayRest);
        });
        this.restMap.addLayer(this.markerClusters);
    }

    // initialise les marqueurs
    initMarkers(filter = false, displayRest, restaurants) {
        console.log("list restaurant:", restaurants);
        let list;
        if (filter) {
            let newRestaurants = restaurants.filter(element => displayRest.getAverageRating(element.ratings) >= filter.min
                && displayRest.getAverageRating(element.ratings) <= filter.max);
            list = newRestaurants;
        }
        else {
            list = restaurants;
        }
        console.log(list);
        this.showRestaurantMarker(list, displayRest);
        displayRest.clearRestaurant();
        displayRest.displayRestaurants(list);
    }

    // efface les marqueurs
    clearMarkers() {
        this.restMap.removeLayer(this.markerClusters);
        this.markerClusters = L.markerClusterGroup();
    }

    resetMarkers(restaurantList, displayRest){
        this.clearMarkers();
        this.showRestaurantMarker(restaurantList, displayRest)
    }
}