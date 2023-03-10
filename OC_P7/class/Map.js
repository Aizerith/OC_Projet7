export class Map {
    constructor(userLat, userLong, zoom) {
        this.userLat = userLat;
        this.userLong = userLong;
        this.zoom = zoom;
        this.map = L.map('map').setView([userLat, userLong], zoom);
        this.markerClusters = L.markerClusterGroup();
    }

    initMap() {
        L.tileLayer('https://maps.geoapify.com/v1/tile/osm-bright-grey/{z}/{x}/{y}.png?apiKey=2ef7298e24614620b7782d66e5959b74', {
            attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
            maxZoom: 20,
            id: 'osm-bright'
        }).addTo(this.map);
        let userPosIcon = L.icon({
            iconUrl: '../images/userPos.png',
            iconSize: [35, 40], // size of the icon
            iconAnchor: [13, 27], // point of the icon which will correspond to marker's location
            popupAnchor: [6, -18] // point from which the popup should open relative to the iconAnchor
        });
        let marker = L.marker([this.userLat, this.userLong], { icon: userPosIcon }).addTo(this.map);
        marker.bindPopup('Votre Position');
        return (this.map);
    }

    createMarker(element, displayRest) {
        let marker = L.marker([element.lat, element.long]).addTo(this.map);
        //let marker = L.marker([element.geo.latitude, element.geo.longitude]).addTo(map); // pour api
        marker.bindPopup(displayRest.showComment(element));
        this.markerClusters.addLayer(marker);
    }

    showRestaurantMarker(jsonObj, displayRest) {
        //console.log(jsonObj.data);
        //jsonObj.data.forEach(element => { // pour api
        jsonObj.forEach(element => {
            this.createMarker(element, displayRest);
        });
        this.map.addLayer(this.markerClusters);
    }
    
    initMarkers(filter = false, displayRest) {
        fetch("./json/restaurant.json")
            .then(response => response.json())
            .then(response => {
                if (filter) {
                    /*let i = 0;
                    while(i < response.length){
                        let averageRating = displayRest.getAverageRating(response[i].ratings);
                        console.log(averageRating);
                        if (!(averageRating >= filter.min && averageRating<= filter.max)) {
                            console.log(response[i].restaurantName, "à filtrer");
                            response.splice(i, 1);
                        }
                        else {
                            console.log(response[i].restaurantName, "à garder");
                            i++;
                        }
                    */
                    response = response.filter(element => displayRest.getAverageRating(element.ratings) >= filter.min
                        && displayRest.getAverageRating(element.ratings) <= filter.max);
                        console.log(response);
                   }
                return response;
            })
            .then(response => {
                this.showRestaurantMarker(response, displayRest);
                displayRest.clearRestaurant();
                displayRest.displayRestaurants(response);
            })
            .catch(err => console.error(err));
    }

    clearMarkers() {
        this.map.removeLayer(this.markerClusters);
        this.markerClusters = L.markerClusterGroup();
    }
}