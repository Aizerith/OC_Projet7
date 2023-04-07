import { Restaurant } from "./Restaurant.js";

export class RestaurantsPanel {
    constructor(parentElt, map, commentForm, restaurantForm) {
        this.map = map;
        this.parentElt = parentElt;
        this.commentForm = commentForm;
        this.restaurantForm = restaurantForm;
    }

    // affiche les restaurants avec les notes moyennes
    displayRestaurants(jsonObj) {
        jsonObj.forEach(element => {
            this.parentElt.innerHTML += `
            <div class="restaurant">
                <p data-restaurant="${element.restaurantName}">${element.restaurantName}<br>Average Rating: ${this.getAverageRating(element.ratings)}</p>
            </div>`
        });
    }

    clearRestaurant() {
        this.parentElt.innerHTML = "";
    }

    // affiche les commentaires sur le popup des marqueurs
    showComment(element) {
        let comments = document.createElement('div');
        comments.innerHTML = `${element.restaurantName} <br> avis : `
        element.ratings.forEach(rating => {
            comments.innerHTML += `${rating.stars}/5 "${rating.comment}"<br>`;
        });
        return (comments);
    }

    // calcule la note moyenne d'un restaurant
    getAverageRating(restaurantRatings) {
        let averageRating = 0;
        let count = 0;
        restaurantRatings.forEach(element=>{
            averageRating += element.stars;
            count++;
        });
        averageRating = averageRating / count;
        return (averageRating);
    }

    // verifie que la note min < que note max
    CheckFilterInputs(minInput, maxInput) {
        console.log(minInput.value, maxInput.value);
        if (minInput.value <= maxInput.value) {
            return false;
        }
        else {
            return true;
        }
    }

    // filtre les restaurants en fonction des notes choisi
    applyFilter(restaurants) {

        let minInput = document.getElementById("min-rate");
        let maxInput = document.getElementById("max-rate");
        let btn = document.getElementById("filterBtn");
        btn.disabled = true;
        let self = this;
    
        minInput.addEventListener('input', e => {
            e.preventDefault();
            btn.disabled = this.CheckFilterInputs(minInput, maxInput);
        });
    
        maxInput.addEventListener('input', e => {
            e.preventDefault();
            btn.disabled = this.CheckFilterInputs(minInput, maxInput);
        });
    
        btn.addEventListener('click', e => {
            e.preventDefault();
            let filter = {
                min: minInput.value,
                max: maxInput.value
            };
            this.map.clearMarkers();
            this.map.initMarkers(filter, self, restaurants);
        })
    }

    // choisi le restaurant ou on ajoute le commentaire en cliquant dessus
    addCommentOnRestaurant(restaurants){
        let clickEvent = document.getElementById("restaurants");
        let self = this;
        clickEvent.addEventListener('click', e => {
            e.preventDefault();
            document.getElementById("add-comment").classList.toggle('active');
            let restaurantName = e.target.getAttribute("data-restaurant");
            console.log(restaurantName)
            self.commentForm.addCommentForm();
            self.commentForm.addCommentOnSubmit(restaurants, restaurantName, self);
            self.clearRestaurant();
            self.displayRestaurants(restaurants);
        });
    }

    // ajoute un restaurant ou on clique sur la map
    addRestaurant(restaurants){
        let self = this;
        this.map.restMap.on('click', function(e){
            let coord = e.latlng;
            let lat = coord.lat;
            let lng = coord.lng;
            console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
            document.getElementById("add-restaurant").classList.toggle('active');
            self.restaurantForm.addRestaurantForm();
            self.restaurantForm.addRestaurantOnSubmit(restaurants, coord, self);
            });
    }
}