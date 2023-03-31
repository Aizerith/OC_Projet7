export class Restaurant {
    constructor(restaurantName, address, lat, long) {
        this.restaurantName = restaurantName;
        this.address = address;
        this.lat = lat;
        this.long = long;
        this.ratings = [];
    }

    addRating(ratings){
        this.ratings.push(ratings);
    }
}