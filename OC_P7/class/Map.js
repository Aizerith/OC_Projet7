export class Map {
    constructor(userLat, userLong, zoom) {
        this.userLat = userLat;
        this.userLong = userLong;
        this.zoom = zoom;
        this.map = L.map('map').setView([userLat, userLong], zoom);
        this.markerClusters = L.markerClusterGroup();
    }

    initMap() {
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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

    createMarker(element) {
        let marker = L.marker([element.lat, element.long]).addTo(this.map);
        //let marker = L.marker([element.geo.latitude, element.geo.longitude]).addTo(map); // pour api
        marker.bindPopup(`${element.restaurantName} <br> avis : "${element.ratings[0].comment}"`);
        this.markerClusters.addLayer(marker);
    }

    showRestaurantMarker(jsonObj) {
        //console.log(jsonObj.data);
        //jsonObj.data.forEach(element => { // pour api
        console.log(jsonObj);
        jsonObj.forEach(element => {
            console.log(element)
            this.createMarker(element);
        });
        this.map.addLayer(this.markerClusters);
        return (jsonObj);
    }
    
    initMarkers(filter = false, displayRest) {
        fetch("./json/restaurant.json")
            .then(response => response.json())
            .then(response => {
                if (filter) {
                    response.forEach((element, index) => {
                        const averageRating = displayRest.getAverageRating(element.ratings);
                        console.log(element.restaurantName, averageRating);
                        if (!(averageRating >= filter.min && averageRating <= filter.max)) {
                            console.log(element.restaurantName, "a filtrer");
                            response.splice(index, 1);
                        }
                    });
                }
                return response;
            })
            .then(response => {
                this.showRestaurantMarker(response)
                displayRest.clearRestaurant();
                displayRest.displayRestaurants(response)
            })
            .catch(err => console.error(err));
    }

    clearMarkers() {
        this.map.removeLayer(this.markerClusters);
        this.markerClusters = L.markerClusterGroup();
    }
}