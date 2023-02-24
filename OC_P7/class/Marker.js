export class Marker {
    constructor(map, userLat, userLong) {
        this.map = map;
        this.userLat = userLat;
        this.userLong = userLong;
    }

    showUserMarker() {
        let userPosIcon = L.icon({
            iconUrl: '../images/userPos.png',
            iconSize: [35, 40], // size of the icon
            iconAnchor: [13, 27], // point of the icon which will correspond to marker's location
            popupAnchor: [6, -18] // point from which the popup should open relative to the iconAnchor
        });
        let marker = L.marker([this.userLat, this.userLong], { icon: userPosIcon }).addTo(this.map);
        marker.bindPopup('Votre Position');
    }

    showRestaurantMarker(jsonObj) {
        let markerClusters = L.markerClusterGroup();
        //console.log(jsonObj.data);
        //jsonObj.data.forEach(element => { // pour api
        jsonObj.forEach(element => {
            let marker = L.marker([element.lat, element.long]).addTo(this.map);
            //let marker = L.marker([element.geo.latitude, element.geo.longitude]).addTo(map); // pour api
            marker.bindPopup(`${element.restaurantName} <br> avis : "${element.ratings[0].comment}"`);
            markerClusters.addLayer(marker);
        });
        this.map.addLayer(markerClusters);
        return (jsonObj);
    }
}