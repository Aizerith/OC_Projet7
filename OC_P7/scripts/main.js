import { RestaurantApp } from "../class/RestaurantApp.js";

let userLat = 48.8737815;
let userLong = 2.3501649;
let srcType = 'localData';
//let srcType = 'api';
let zoom;

function successPosition(position) {
    return [position.coords.latitude, position.coords.longitude];
}

async function getUserPos() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
            resolve(successPosition(position));
        })
    })
}

async function initApp() {
    if (srcType === 'localData') {
        zoom = 13;
        let app = new RestaurantApp(userLat, userLong, srcType, zoom);
        app.getRestaurantsList();
    } else if (srcType === 'api') {
        zoom = 20;
        if (navigator.geolocation) {
            await getUserPos().then(coords => {
                let app = new RestaurantApp(coords[0], coords[1], srcType, zoom);
                app.getRestaurantsList();
            });
        } else {
            let app = new RestaurantApp(userLat, userLong, srcType, zoom);
            app.getRestaurantsList();
        };
    }
}

window.initApp = initApp;
