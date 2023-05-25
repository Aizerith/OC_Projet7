import { RestaurantApp } from "../class/RestaurantApp.js";
import { getGeoStatus, getUserPos } from "./geolocation.js";

// paramètre par defaut pour le local
let userLat = 48.8737815;
let userLong = 2.3501649;
let srcType = 'localData';
//let srcType = 'api';
let zoom = 13;


async function initApp() {
    // on change quelques paramètres si on utilise l'api
    if (srcType === 'api') {
        let hasGeo = await getGeoStatus();
        zoom = 16;
        if (hasGeo) {
            const coord = await getUserPos();
            userLat = coord[0];
            userLong = coord[1];
        }
    }
    let app = new RestaurantApp(userLat, userLong, srcType, zoom);
    app.getRestaurantsList();
}

window.initApp = initApp;
