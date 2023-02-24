export class Map {
    constructor(lat, long, zoom) {
        this.lat = lat;
        this.long = long;
        this.zoom = zoom;
    }

    initMap(lat = this.lat, long = this.long, zoom = this.zoom) {
        let map = L.map('map').setView([lat, long], zoom);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        return (map);
    }
}