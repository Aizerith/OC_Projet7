export class Restaurant {
    constructor(restaurantName, address, lat, long, averageRating = 0, place_id = 0) {
        this.restaurantName = restaurantName;
        this.address = address;
        this.lat = lat;
        this.long = long;
        this.ratings = [];
        this.averageRating = averageRating;
        this.place_id = place_id
    }

    addRating(ratings){
        this.ratings.push(ratings);
    }
}