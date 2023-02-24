export class Restaurants {
    constructor(parentElt) {
        this.parentElt = parentElt;
        this.restoList; // jsonObj ne se copie pas
    }

    displayRestaurants(jsonObj) {
        jsonObj.forEach(element => {
            this.parentElt.innerHTML += `
            <div class="restaurant">
                <p data-restaurant=${element.restaurantName}>${element.restaurantName}<br>Average Rating: ${this.getAverageRating(element.ratings)}</p>
            </div>`
        });
    }

    getAverageRating(restoRatings) {
        let averageRating = 0;
        let count = 0;
        restoRatings.forEach(element=>{
            averageRating += element.stars;
            count++;
        });
        averageRating = averageRating / count; // lenght fonctionne pas
        return (averageRating);
    }
}