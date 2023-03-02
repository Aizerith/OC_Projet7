export class Marker {
    constructor(map, userLat, userLong) {
        this.map = map;
        this.userLat = userLat;
        this.userLong = userLong;
    }

    createMarker(element) {
        let marker = L.marker([element.lat, element.long]).addTo(this.map.map);
        //let marker = L.marker([element.geo.latitude, element.geo.longitude]).addTo(map); // pour api
        marker.bindPopup(`${element.restaurantName} <br> avis : "${element.ratings[0].comment}"`);
        this.map.markerClusters.addLayer(marker);
    }

    showRestaurantMarker(jsonObj) {
        //console.log(jsonObj.data);
        //jsonObj.data.forEach(element => { // pour api
        console.log(jsonObj);
        jsonObj.forEach(element => {
            console.log(element)
            this.createMarker(element);
        });
        this.map.map.addLayer(this.map.markerClusters);
        return (jsonObj);
    }
}