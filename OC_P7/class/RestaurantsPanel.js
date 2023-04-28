import { Restaurant } from "./Restaurant.js";

export class RestaurantsPanel {
    constructor(parentElt, map, commentForm, restaurantForm, app) {
        this.map = map;
        this.parentElt = parentElt;
        this.commentForm = commentForm;
        this.restaurantForm = restaurantForm;
        this.app = app;
    }

    // affiche les restaurants avec les notes moyennes
    displayRestaurants(jsonObj) {
        jsonObj.forEach(element => {
            this.parentElt.innerHTML += `
            <div class="restaurant">
                <p data-restaurant="${element.restaurantName}">${element.restaurantName}<br>Average Rating: ${this.getAverageRating(element)}</p>
            </div>`
        });
    }

    clearRestaurant() {
        this.parentElt.innerHTML = "";
    }

    // affiche les commentaires sur le popup des marqueurs
    showComment(element) {
        let comments = document.createElement('div');
        console.log("showcomment element", element);
        console.log("showcomment element rating", element.ratings);
        comments.innerHTML = `${element.restaurantName} <br> avis : `
        let commentLenght = (element.ratings.lenght > 3) ? 3 : element.ratings.lenght;

        for (let i = 0; i < commentLenght; i++) {
            console.log("element rating dans for", element.ratings, i, element.ratings[i]);

            //comments.innerHTML += `${element.ratings[i].stars}/5 "${element.ratings[i].comment}"<br>`;
        }/*
        element.ratings.forEach((rating , i) => {
            if (i < 3) {
                 comments.innerHTML += `${rating.stars}/5 "${rating.comment}"<br>`;
            }
        });*/
        return (comments);
    }

    addCommentFromApi(restaurant) {
            let service;
            let result = document.getElementById('google-result');
            let request = {
                placeId: restaurant.place_id,
                fields: ['reviews']
            };
            service = new google.maps.places.PlacesService(result);
            service.getDetails(request, (results, status)=> {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    results.reviews.forEach(el => {
                        restaurant.ratings.push({"stars": el.rating, "comment": el.text})
                    });
                }
            });
    }

    // calcule la note moyenne d'un restaurant
    getAverageRating(restaurant) {
        let averageRating = 0;
        let count = 0;
        if (this.app.srcType === 'localData') {
            console.log("je suis dnas local")
            restaurant.ratings.forEach(element => {
                averageRating += element.stars;
                count++;
            });
            averageRating = averageRating / count;
            return (averageRating).toFixed(1);
        } else if (this.app.srcType === 'api') {
            return restaurant.averageRating;
        }
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