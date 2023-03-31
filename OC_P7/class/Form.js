import { Restaurant } from "./Restaurant.js";

export class Form {
    constructor(map) {
        this.commentFormElt = document.getElementById("add-comment");
        this.restFormElt = document.getElementById("add-restaurant");
        this.map = map;
    }

    // créer le formulaire pour ajouter un commentaire pour un restaurant
    addCommentForm() {
        this.commentFormElt.innerHTML = `
                <div class="modal">
                    <h2>Ajouter un avis</h2>
                    <form methode="get" class="add-comment-form">
                        <div class="comment-form">
                            <label for="stars">Note: </label>
                            <input type="number" id="stars" name="stars" min="1" max ="5" required>
                        </div>
                        <div class="comment-form">
                            <label for="comment">Commentaire: </label>
                            <input type="text" id="comment" name="comment">
                        </div>
                        <input type="submit" value="Ajouter" id="confirm-comment">
                    </form>
                </div>
                `
    }

    addRestaurantForm() {
        this.restFormElt.innerHTML = `
                <div class="modal">
                    <h2>Ajouter un restaurant</h2>
                    <form methode="get" class="add-restaurant-form">
                        <div class="restaurant-form">
                            <label for="restaurantName">Nom: </label>
                            <input type="text" id="restaurantName "name="restaurantName" required>
                        </div>
                        <div class="restaurant-form">
                            <label for="address">Adresse: </label>
                            <input type="text" id="address" name="address" required>
                        </div>
                        <div class="restaurant-form">
                            <label for="stars">Note: </label>
                            <input type="number" id="stars" name="stars" min="1" max ="5" required>
                        </div>
                        <div class="restaurant-form">
                            <label for="comment">Commentaire: </label>
                            <input type="text" id="comment" name="comment">
                        </div>
                        <input type="submit" value="Ajouter" id="confirm-restaurant">
                    </form>
                </div>
                `
    }

    // ajoute le commentaire quand on envoie le formulaire
    addCommentOnSubmit(restaurantList, restaurantName, displayRest) {
        const form = document.querySelector("form.add-comment-form");
        let self = this;
        form.addEventListener('submit', e => {
            e.preventDefault();
            document.getElementById("add-comment").classList.toggle('active');
            console.log(self.getFormData("form.add-comment-form"));
            restaurantList.forEach(element => {
                if (element.restaurantName == restaurantName) {
                    element.ratings.push(self.getFormData("form.add-comment-form"));
                }
                console.log(element.ratings)
            });
            self.map.resetMarkers(restaurantList, displayRest);
        });
    }

    addRestaurantOnSubmit(restaurantList, coord, displayRest) {
        const form = document.querySelector("form.add-restaurant-form");
        let self = this;
        form.addEventListener('submit', e => {
            e.preventDefault();
            document.getElementById("add-restaurant").classList.toggle('active');
            let data = self.getFormData("form.add-restaurant-form")
            let restaurant = new Restaurant(data.restaurantName, data.address, coord.lat, coord.lng);
            restaurant.addRating({"stars" : data.stars, "comment": data.comment});
            restaurantList.push(restaurant);
            console.log(restaurantList);
            self.map.resetMarkers(restaurantList, displayRest);
            displayRest.clearRestaurant();
            displayRest.displayRestaurants(restaurantList);
         
        });
    }

    // recupere la note et le commentaire du formulaire
    getFormData(dataLocation)
    {
        const form = document.querySelector(dataLocation);
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.stars = Number(data.stars);
        return data;
    }
}