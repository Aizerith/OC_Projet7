export class RestaurantsPanel {
    constructor(parentElt, map, commentForm, restaurantForm, app) {
        this.map = map;
        this.parentElt = parentElt;
        this.commentForm = commentForm;
        this.restaurantForm = restaurantForm;
        this.app = app;
        this.filter;
    }

    // affiche les restaurants avec les notes moyennes
    displayRestaurants(jsonObj) {
        jsonObj.forEach(element => {
            this.parentElt.innerHTML += `
            <div class="restaurant">
                <p data-restaurant="${element.restaurantName}">
                <span style="font-weight: 700;">${element.restaurantName}</span>
                <br>Average Rating: ${this.getAverageRating(element)}
                </p>
            </div>`
        });
    }

    clearRestaurant() {
        this.parentElt.innerHTML = "";
    }

    // affiche les commentaires sur le popup des marqueurs
    showComment(element) {
        let comments = document.createElement('div');
        comments.innerHTML = `${element.restaurantName}<br><br>`
        element.ratings.forEach((rating) => {
            comments.innerHTML += `${rating.stars}/5<br>"${rating.comment}"<br><br>`;
        });
        return (comments);
    }


    async addCommentFromApi(restaurant, popup) {
            let service;
            let result = document.getElementById('google-result');
            let request = {
                placeId: restaurant.place_id,
                fields: ['reviews']
            };
            const self = this;
            service = new google.maps.places.PlacesService(result);
            service.getDetails(request, (results, status)=> {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    const reviews = results.reviews;
                    if (reviews) {
                        reviews.forEach(el => {
                            restaurant.ratings.push({"stars": el.rating, "comment": el.text})
                        });
                    }
                    popup.setContent(self.showComment(restaurant));
                }
            });
    }

    // calcule la note moyenne d'un restaurant
    getAverageRating(restaurant) {
        let averageRating = 0;
        let count = 0;
        if (this.app.srcType === 'localData') {
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
    
        // on verifie que min < max
        minInput.addEventListener('input', e => {
            e.preventDefault();
            btn.disabled = this.CheckFilterInputs(minInput, maxInput);
        });
        maxInput.addEventListener('input', e => {
            e.preventDefault();
            btn.disabled = this.CheckFilterInputs(minInput, maxInput);
        });
    
        // crée le filtre lorsqu'on valide
        btn.addEventListener('click', e => {
            e.preventDefault();
            this.filter = {
                min: minInput.value,
                max: maxInput.value
            };
            this.map.clearMarkers();
            this.map.initMarkers(this.filter, self, restaurants);
        })
    }

    // choisi le restaurant ou on ajoute le commentaire en cliquant dessus
    addCommentOnRestaurant(restaurants){
        let clickEvent = document.getElementById("restaurants");
        let self = this;
        clickEvent.addEventListener('click', e => {
            e.preventDefault();
            let restaurantName = e.target.getAttribute("data-restaurant");
            if (restaurantName != null){
                document.getElementById("add-comment").classList.toggle('active');
                self.commentForm.addCommentForm();
                self.commentForm.addCommentOnSubmit(restaurants, restaurantName, self);
            }
        });
    }

    // ajoute un restaurant ou on clique sur la map
    addRestaurant(restaurants){
        let self = this;
        this.map.restMap.on('click', function(e){
            let coord = e.latlng;
            document.getElementById("add-restaurant").classList.toggle('active');
            self.restaurantForm.addRestaurantForm();
            self.restaurantForm.addRestaurantOnSubmit(restaurants, coord, self);
            });
    }
}