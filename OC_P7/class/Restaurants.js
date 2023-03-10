export class Restaurants {
    constructor(parentElt, map) {
        this.map = map;
        this.parentElt = parentElt;
    }

    displayRestaurants(jsonObj) {
        jsonObj.forEach(element => {
            this.parentElt.innerHTML += `
            <div class="restaurant">
                <p data-restaurant=${element.restaurantName}>${element.restaurantName}<br>Average Rating: ${this.getAverageRating(element.ratings)}</p>
            </div>`
        });
    }

    clearRestaurant() {
        this.parentElt.innerHTML = "";
    }

    showComment(element) {
        let comments = document.createElement('div');
        comments.innerHTML = `${element.restaurantName} <br> avis : `
        element.ratings.forEach(rating => {
            comments.innerHTML += `${rating.stars}/5 "${rating.comment}"<br>`;
        });
        return (comments);
    }

    getAverageRating(restoRatings) {
        let averageRating = 0;
        let count = 0;
        restoRatings.forEach(element=>{
            averageRating += element.stars;
            count++;
        });
        averageRating = averageRating / count;
        return (averageRating);
    }
}